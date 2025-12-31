import { MinvoiceError } from "./error.js";

export class MinvoiceHelper {
  static mapInvoicePayload(input, config) {
    // Validate input
    if (!input.items || input.items.length === 0) {
      throw new MinvoiceError("Hóa đơn phải có ít nhất 1 sản phẩm");
    }

    // Map chi tiết hàng hóa
    const details = input.items.map((item, idx) => ({
      tchat: 1,
      stt_rec0: idx + 1,
      inv_itemCode: item.code || `ITEM${idx + 1}`,
      inv_itemName: item.name,
      inv_unitCode: item.unit || "Phần",
      inv_quantity: item.quantity,
      inv_unitPrice: item.price,
      inv_discountPercentage: item.discountPercentage || 0,
      inv_discountAmount: item.discountAmount || 0,
      inv_TotalAmountWithoutVat:
        item.quantity * item.price - (item.discountAmount || 0),
    }));

    // Tính tổng tiền trước thuế
    const totalBeforeVat = details.reduce(
      (sum, item) => sum + item.inv_TotalAmountWithoutVat,
      0
    );

    // Tính thuế GTGT và giảm thuế (nếu có)
    let vatAmount = 0;
    let deductionAmount = 0;
    let finalTotal = totalBeforeVat;

    if (input.applyTaxDeduction) {
      // Áp dụng giảm thuế theo NQ 204
      const vatRate = input.vatRateByRevenue || 1;
      vatAmount = totalBeforeVat * (vatRate / 100);
      deductionAmount = input.taxDeductionAmount || 0;
      finalTotal = totalBeforeVat + vatAmount - deductionAmount;
    } else {
      // Tính thuế GTGT bình thường
      const defaultVatRate = input.defaultVatRate || 10;
      vatAmount = totalBeforeVat * (defaultVatRate / 100);
      finalTotal = totalBeforeVat + vatAmount;
    }

    // Tạo payload theo format M-Invoice
    return {
      editmode: 1,
      data: [
        {
          // Thông tin hóa đơn
          inv_invoiceSeries: config.serial || config.invoiceSeries,
          inv_invoiceIssuedDate:
            input.issueDate || new Date().toISOString().split("T")[0],
          inv_currencyCode: input.currencyCode || "VND",
          inv_exchangeRate: input.exchangeRate || 1,

          // Thông tin bổ sung
          ...(input.medicalRecordNo && { so_benh_an: input.medicalRecordNo }),
          ...(input.citizenId && { cccdan: input.citizenId }),
          ...(input.passportNo && { so_hchieu: input.passportNo }),
          ...(input.buyerCode && { mdvqhnsach_nmua: input.buyerCode }),
          ...(input.storeCode && { ma_ch: input.storeCode }),
          ...(input.storeName && { ten_ch: input.storeName }),

          // Thông tin người mua
          inv_buyerDisplayName: input.customerName,
          inv_buyerLegalName: input.customerLegalName || input.customerName,
          inv_buyerTaxCode: input.customerTaxCode || "",
          inv_buyerAddressLine: input.customerAddress || "",
          inv_buyerEmail: input.customerEmail || "",
          inv_buyerBankAccount: input.customerBankAccount || "",
          inv_buyerBankName: input.customerBankName || "",
          inv_paymentMethodName: input.paymentMethod || "TM/CK",

          // Thuế và giảm giá
          nonTaxZone: input.nonTaxZone || 1,
          inv_discountAmount: input.invoiceDiscountAmount || 0,

          // Giảm thuế theo NQ 204
          isDeductionNQ43: input.applyTaxDeduction || false,
          ...(input.applyTaxDeduction && {
            tlptdoanhthu20: input.vatRateByRevenue || 1,
            tgtck20: deductionAmount,
          }),

          // Tổng tiền
          inv_TotalAmount: Math.round(finalTotal),

          // Chi tiết hàng hóa
          details: [
            {
              data: details,
            },
          ],
        },
      ],
    };
  }
}

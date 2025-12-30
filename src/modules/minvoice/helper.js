import { MinvoiceError } from "./error.js";

export class MinvoiceHelper {
  static mapInvoicePayload(input, config) {
    const items = input.items.map((i, idx) => ({
      lineNumber: idx + 1,
      itemName: i.name,
      unitName: i.unit || "Lần",
      quantity: i.quantity,
      unitPrice: i.price,
      vatRate: i.vatRate ?? 10,
      amount: i.quantity * i.price,
    }));

    return {
      templateCode: config.templateCode,
      serial: config.serial,
      invoiceType: 1,
      buyerName: input.customerName,
      buyerTaxCode: input.customerTaxCode || "",
      buyerAddress: input.customerAddress,
      buyerEmail: input.customerEmail,
      paymentMethod: input.paymentMethod || "TM/CK",
      items,
      totalAmount: items.reduce((s, i) => s + i.amount, 0),
    };
  }
}

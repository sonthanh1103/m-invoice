import { MinvoiceClient } from "./client.js";
import { MinvoiceHelper } from "./helper.js";
import { CONFIG } from "./config.js";
import { MinvoiceError } from "./error.js";

export class Service {
  constructor() {
    this.client = new MinvoiceClient();
  }

  async issueInvoice(data) {
    console.log("ISSUE INVOICE:", data);
    return {
      invoiceNo: "00001234",
      pdfUrl: "https://example.com/invoice.pdf",
      xmlUrl: "https://example.com/invoice.xml",
    };
  }

  async cancelInvoice(invoiceNo, reason) {
    console.log("CANCEL INVOICE:", invoiceNo, reason);
    return { invoiceNo, status: "CANCELED" };
  }

  // async issueInvoice(input) {
  //   const payload = MinvoiceHelper.mapInvoicePayload(input, CONFIG);

  //   const res = await this.client.post("/invoice/issue", payload);
  //   console.log(res);

  //   if (!res.invoiceNo)
  //     throw new MinvoiceError(
  //       "ISSUE_FAILED",
  //       "Không phát hành được hóa đơn",
  //       res
  //     );

  //   return {
  //     invoiceNo: res.invoiceNo,
  //     lookupCode: res.lookupCode,
  //     pdfUrl: res.pdfUrl,
  //     xmlUrl: res.xmlUrl,
  //   };
  // }

  // async cancelInvoice(invoiceNo, reason) {
  //   if (!invoiceNo)
  //     throw new MinvoiceError("INVALID_INPUT", "invoiceNo is required");
  //   if (!reason) reason = "Hủy hóa đơn";

  //   return this.client.post("/invoice/cancel", { invoiceNo, reason });
  // }
}

import { MinvoiceClient } from "./client.js";
import { MinvoiceHelper } from "./helper.js";
import { CONFIG } from "./config.js";
import { MinvoiceError } from "./error.js";

export class Service {
  constructor() {
    this.client = new MinvoiceClient();
  }

  async issueInvoice(input) {
    try {
      const payload = MinvoiceHelper.mapInvoicePayload(input, CONFIG);
      const res = await this.client.post("/api/InvoiceApi78/Save", payload);

      // Validate response
      if (!res.invoiceNo) {
        throw new MinvoiceError(
          "ISSUE_FAILED",
          "Không phát hành được hóa đơn",
          res
        );
      }

      return {
        invoiceNo: res.invoiceNo,
        lookupCode: res.lookupCode,
        pdfUrl: res.pdfUrl,
        xmlUrl: res.xmlUrl,
      };
    } catch (error) {
      console.error("Issue Invoice Error:", error);
      throw error;
    }
  }

  async cancelInvoice(invoiceNo, reason) {
    if (!invoiceNo) {
      throw new MinvoiceError("INVALID_INPUT", "invoiceNo is required");
    }

    if (!reason) {
      reason = "Hủy hóa đơn";
    }

    try {
      const res = await this.client.post("/invoice/cancel", {
        invoiceNo,
        reason,
      });

      return {
        invoiceNo,
        status: "CANCELED",
        ...res,
      };
    } catch (error) {
      console.error("Cancel Invoice Error:", error);
      throw error;
    }
  }
}

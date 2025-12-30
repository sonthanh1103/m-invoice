import { Service } from "./service.js";

export class Controller {
  constructor() {
    this.service = new Service();
  }

  issueInvoice = async (req, res, next) => {
    try {
      const result = await this.service.issueInvoice(req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };

  cancelInvoice = async (req, res, next) => {
    try {
      const { invoiceNo, reason } = req.body;
      const result = await this.service.cancelInvoice(invoiceNo, reason);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  };
}

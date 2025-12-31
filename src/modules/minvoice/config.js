import "dotenv/config";

export const CONFIG = {
  get baseURL() {
    if (this.environment === "production") {
      return `https://${this.taxCode}.minvoice.app`;
    } else {
      return "https://0106026495-999.minvoice.site";
    }
  },

  username: process.env.MINVOICE_USERNAME,
  password: process.env.MINVOICE_PASSWORD,
  taxCode: process.env.MINVOICE_TAX_CODE,
  templateCode: process.env.MINVOICE_TEMPLATE_CODE || "01GTKT0/001",
  serial: process.env.MINVOICE_SERIAL || "AA/23E",
  environment: process.env.NODE_ENV || "development",
};

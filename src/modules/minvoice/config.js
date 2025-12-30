import "dotenv/config";

export const CONFIG = {
  baseUrl: process.env.MINVOICE_BASE_URL,
  username: process.env.MINVOICE_USERNAME,
  password: process.env.MINVOICE_PASSWORD,
  taxCode: process.env.MINVOICE_TAX_CODE,
  templateCode: process.env.MINVOICE_TEMPLATE_CODE || "01GTKT0/001",
  serial: process.env.MINVOICE_SERIAL || "AA/23E",
};

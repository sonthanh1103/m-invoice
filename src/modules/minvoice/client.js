import axios from "axios";
import { CONFIG } from "./config.js";

export class MinvoiceClient {
  constructor() {
    this.http = axios.create({ baseURL: CONFIG.baseUrl, timeout: 15000 });
    this.token = null;
    this.expiredAt = 0;
  }

  async getToken() {
    if (this.token && Date.now() < this.expiredAt) return this.token;

    const res = await axios.post(`${CONFIG.baseUrl}/auth/login`, {
      username: CONFIG.username,
      password: CONFIG.password,
      taxCode: CONFIG.taxCode,
    });

    console.log(res);

    this.token = res.data.access_token;
    this.expiredAt = Date.now() + res.data.expires_in * 1000;
    return this.token;
  }

  async post(path, data) {
    const token = await this.getToken();
    const res = await this.http.post(path, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
}

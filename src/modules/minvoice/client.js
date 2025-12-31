import axios from "axios";
import { CONFIG } from "./config.js";

export class MinvoiceClient {
  constructor() {
    this.http = axios.create({ baseURL: CONFIG.baseURL, timeout: 15000 });
    this.token = null;
    this.expiredAt = 0;
  }

  async getToken() {
    if (this.token && Date.now() < this.expiredAt) return this.token;

    const api = `${CONFIG.baseURL}/api/Account/Login`;
    const res = await axios.post(
      api,
      {
        username: CONFIG.username,
        password: CONFIG.password,
        taxCode: CONFIG.taxCode,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Login response:", res.data);

    // Check nếu login thất bại
    if (res.data.ok === false || res.data.code === "99") {
      throw new Error(res.data.error || res.data.message || "Login failed");
    }

    // Lấy token từ response
    this.token =
      res.data.access_token || res.data.token || res.data.data?.token;

    if (!this.token) {
      throw new Error("Token không tồn tại trong response");
    }

    this.expiredAt = Date.now() + (res.data.expires_in || 3600) * 1000;

    console.log("✅ Token:", this.token);
    return this.token;
  }

  async post(path, data) {
    try {
      const token = await this.getToken();
      const res = await this.http.post(path, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      if (error.response?.status === 401 && this.token) {
        console.log(" Token expired, retrying...");
        this.token = null;
        this.expiredAt = 0;
        return this.get(path); // Retry once
      }

      console.error("❌ API Error:", error.response?.data || error.message);
      throw error;
    }
  }
}

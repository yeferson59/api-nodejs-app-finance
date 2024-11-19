import { apiKeyDemo, apiUrl } from "@/config";
import axios from "axios";

export default class Market {
  static async getStock(ticket: string) {
    const { data } = await axios.get(
      `${apiUrl}?function=TIME_SERIES_DAILY&symbol=${ticket}&apikey=${apiKeyDemo}`
    );
    return data;
  }
}

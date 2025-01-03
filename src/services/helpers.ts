import axios, { AxiosResponse } from "axios";
import { RequestOptions } from "./types";

const API_BASE_URL = "http://192.168.86.28:5000";

export async function makeRequest({
  method,
  endpoint,
  data = null,
}: RequestOptions): Promise<AxiosResponse> {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      ...(data && { data }),
    };
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
}

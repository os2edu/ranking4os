import { api } from "boot/axios";

/**
 * @description -排行版api
 */
export class RankingService {
  static async list(page, size, name) {
    // http:ip/api/v1/ranking?page=1&size=30&name=""
    return api.get("/api/v1/ranking", {
      params: { page: page, size: size, name: name },
    });
  }
}

import { HTTPResponse } from "../../http/http";

interface TokenStrI {
  value: string;
  expiresAt: string;
}

export interface Token {
  value: string;
  expiresAt: Date;
}
interface refreshAccessTokenI {
  token: string;
}

interface refreshAccessTokenResponse {
  token: TokenStrI;
}
interface TokenPayload {
  userId: number;
}

type TokensI = [Token, Token];

export class AuthHandler {
  public static ACCESS_TOKEN_KEY = "accessToken";
  public static REFRESH_TOKEN_KEY = "refreshToken";
  private accessToken: Token;
  private refreshToken: Token;

  constructor() {
    const [accessToken, refreshToken] = this.getTokens();
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public async getAuthHeader() {
    if (this.isAccessExpired()) {
      await this.refreshAccessToken();
    }
    return "Bearer " + this.accessToken.value;
  }

  public async refreshAccessToken() {
    if (this.isRefreshExpired()) {
      throw new HTTPResponse("missing refresh token", 401);
    }
    try {
      const json: TokenStrI = await this.fetchRefreshAccessToken({
        token: this.refreshToken.value,
      });
      const accessToken: Token = {
        value: json.value,
        expiresAt: new Date(json.expiresAt),
      };
      this.setAccessToken(accessToken);
    } catch (error) {
      if (error instanceof HTTPResponse) {
        throw error;
      }
      throw new HTTPResponse("failed to refresh", 400);
    }
  }

  public getAccessToken() {
    return this.accessToken;
  }

  public setAccessToken(token: Token) {
    localStorage.setItem(AuthHandler.ACCESS_TOKEN_KEY, JSON.stringify(token));
    this.accessToken = token;
  }

  public setRefreshToken(token: Token) {
    localStorage.setItem(AuthHandler.REFRESH_TOKEN_KEY, JSON.stringify(token));
    this.refreshToken = token;
  }

  public static saveTokens(accessToken: Token, refreshToken: Token) {
    localStorage.setItem(
      AuthHandler.ACCESS_TOKEN_KEY,
      JSON.stringify(accessToken),
    );
    localStorage.setItem(
      AuthHandler.REFRESH_TOKEN_KEY,
      JSON.stringify(refreshToken),
    );
  }

  public static clearTokens() {
    localStorage.removeItem(AuthHandler.ACCESS_TOKEN_KEY);
    localStorage.removeItem(AuthHandler.REFRESH_TOKEN_KEY);
  }

  public static decodeAccessToken(token: Token) {
    const base64Url = token.value.split(".")[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Convert to base64
    const payload: TokenPayload = JSON.parse(atob(base64)); // Decode and parse JSON
    return payload.userId;
  }

  private isRefreshExpired() {
    return new Date() > this.refreshToken.expiresAt;
  }

  private isAccessExpired() {
    return new Date() > this.accessToken.expiresAt;
  }

  private getTokens(): TokensI {
    const accessStr: string | null = localStorage.getItem(
      AuthHandler.ACCESS_TOKEN_KEY,
    );
    const refreshStr: string | null = localStorage.getItem(
      AuthHandler.REFRESH_TOKEN_KEY,
    );
    if (!accessStr || !refreshStr) {
      throw "Missing access or refresh token";
    }
    const accessJson: TokenStrI = JSON.parse(accessStr);
    const refreshJson: TokenStrI = JSON.parse(refreshStr);

    const accessToken: Token = {
      value: accessJson.value,
      expiresAt: new Date(accessJson.expiresAt),
    };
    const refreshToken: Token = {
      value: refreshJson.value,
      expiresAt: new Date(refreshJson.expiresAt),
    };

    return [accessToken, refreshToken];
  }

  async fetchRefreshAccessToken(params: refreshAccessTokenI) {
    const result = await fetch(import.meta.env.VITE_BASE_URL + "/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!result.ok) {
      throw new HTTPResponse("failed refresh", result.status);
    }
    const body: refreshAccessTokenResponse = await result.json();
    return body.token;
  }
}

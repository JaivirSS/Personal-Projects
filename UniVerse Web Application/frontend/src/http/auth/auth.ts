import { HTTPResponse } from "../http";

interface fetchLoginI {
  email: string;
  password: string;
}

interface Token {
  value: string;
  expiresAt: Date;
}

interface authResponse {
  accessToken: Token;
  refreshToken: Token;
}

interface authResponseJSON {
  accessToken: Token;
  refreshToken: Token;
}

export async function fetchLogin(params: fetchLoginI) {
  const result = await fetch(import.meta.env.VITE_BASE_URL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!result.ok) {
    throw new HTTPResponse("failed to login", result.status);
  }
  const body: authResponseJSON = await result.json();

  const data: authResponse = {
    accessToken: {
      value: body.accessToken.value,
      expiresAt: new Date(body.accessToken.expiresAt),
    },
    refreshToken: {
      value: body.refreshToken.value,
      expiresAt: new Date(body.refreshToken.expiresAt),
    },
  };
  return data;
}

interface fetchRegisterI {
  username: string;
  email: string;
  password: string;
}

export async function fetchRegister(params: fetchRegisterI) {
  const result = await fetch(import.meta.env.VITE_BASE_URL + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!result.ok) {
    throw new HTTPResponse("failed to register", result.status);
  }
  const body: authResponseJSON = await result.json();
  const data: authResponse = {
    accessToken: {
      value: body.accessToken.value,
      expiresAt: new Date(body.accessToken.expiresAt),
    },
    refreshToken: {
      value: body.refreshToken.value,
      expiresAt: new Date(body.refreshToken.expiresAt),
    },
  };
  return data;
}

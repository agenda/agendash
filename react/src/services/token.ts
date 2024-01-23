import JWT from "jwt-client";
const AGENDASH_TOKEN_STORAGE = "agendash-token";

let token: string | null = null;

export const getToken = () => {
  if (token) {
    return token;
  } else {
    return localStorage.getItem(AGENDASH_TOKEN_STORAGE);
  }
};

export const setToken = (newToken: string) => {
  token = newToken;
  localStorage.setItem(AGENDASH_TOKEN_STORAGE, newToken);
};

export const clearToken = () => {
  token = null;
  localStorage.removeItem(AGENDASH_TOKEN_STORAGE);
};

export const checkToken = () => {
  const token = getToken();
  if (!token) return false;

  return JWT.validate(JWT.read(token));
};

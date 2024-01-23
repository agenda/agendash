import request from "../services/request";

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const login = async (input: LoginInput): Promise<LoginResponse> => {
  const data = await request().post<LoginResponse>("login", input);
  return data.data;
};

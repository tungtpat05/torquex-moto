import { axiosClient } from "../lib/axiosClient";
import { User } from "../types/user.ts";

export const getUser = async (): Promise<User> => {
    const response = await axiosClient.get<User>("/auth/me");
    return response.data;
};

export const loginWithEmail = async (
    email: string,
    password: string
): Promise<{ token?: string; user: User }> => {
    const response = await axiosClient.post<{ token: string }>(
        "/auth/login",
        { email, password }
    );
    // Authentication relies on HttpOnly cookie set by server response
    const user = await getUser();
    return { token: response.data.token, user };
};

export const loginWithOAuth = async (provider: string): Promise<string> => {
    const response = await axiosClient.get<{ redirectUrl: string }>(
        `/auth/oauth/${provider}`
    );
    return response.data.redirectUrl;
};

export const register = async (
    email: string,
    password: string,
    fullName: string
): Promise<{ token?: string; user: User }> => {
    const response = await axiosClient.post<{ token: string }>(
        "/auth/register",
        { email, password, fullName }
    );
    // Authentication relies on HttpOnly cookie set by server response
    const user = await getUser();
    return { token: response.data.token, user };
};

export const logout = async (): Promise<void> => {
    await axiosClient.post("/auth/logout");
};

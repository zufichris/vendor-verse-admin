import { User } from "./user.types";

export interface AuthData {
    accessToken: string;
    expiresIn: number;
    user?: User;
}
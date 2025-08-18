import { AxiosError } from "axios";

export interface ApiError {
    error: string;
    code: string;
}

export type ApiAxiosError = AxiosError<ApiError>;
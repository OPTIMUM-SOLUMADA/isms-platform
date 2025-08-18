import { AxiosError } from "axios";

export interface ApiError {
    error: string;
}

export type ApiAxiosError = AxiosError<ApiError>;
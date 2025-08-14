export { };

declare module "axios" {
    // Extend AxiosError so .response.data always has `error?: string`
    export interface AxiosError<T = any, D = any> {
        response?: AxiosResponse<
            (T extends object ? T : Record<string, any>) & { error?: string },
            D
        >;
    }
}

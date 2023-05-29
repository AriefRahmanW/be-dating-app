import { IBaseResponse } from "src/interfaces/base-response.interface";

export interface ILoginResponse extends IBaseResponse{
    payload: {
        accessToken: string
    }
}
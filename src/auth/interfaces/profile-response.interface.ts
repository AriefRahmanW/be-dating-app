import { IBaseResponse } from "src/interfaces/base-response.interface";

export interface IProfileResponse extends IBaseResponse{
    payload: {
        id: string,
        name: string,
        isVerified: boolean
    }
}
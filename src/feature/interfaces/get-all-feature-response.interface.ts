import { Feature } from "@prisma/client";
import { IBaseResponse } from "src/interfaces/base-response.interface";

export interface IGetAllFeatureResponse extends IBaseResponse{
    payload: Feature[]
}
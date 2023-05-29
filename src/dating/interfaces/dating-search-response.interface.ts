import { User } from "@prisma/client";
import { IBaseResponse } from "src/interfaces/base-response.interface";

export interface IDatingSearchResponse extends IBaseResponse{
    payload: User[] | object[]
}
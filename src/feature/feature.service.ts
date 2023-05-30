import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../src/prisma/prisma.service";
import { IGetAllFeatureResponse } from "./interfaces/get-all-feature-response.interface";
import { CommonService } from "../../src/common/common.service";

@Injectable()
export class FeatureService{
    constructor(
        private prismaService: PrismaService,
        private commonService: CommonService
    ){}
    async getAll(packageId: string): Promise<IGetAllFeatureResponse>{
        try{
            const features = await this.prismaService.feature.findMany({
                where: {
                    packageId: packageId
                }
            })

            return {
                statusCode: 200,
                message: "Ok",
                payload: features
            }
        }catch(e){
            this.commonService.catchError(e)
        }
    }
}
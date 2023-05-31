import { BadRequestException, Injectable } from "@nestjs/common";
import { CommonService } from "src/common/common.service";
import { IBaseResponse } from "src/interfaces/base-response.interface";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PurchaseService{
    constructor(
        private prismaService: PrismaService,
        private commonService: CommonService
    ){}
    async addPurchaes(userId: string, featureId: string, balance: number): Promise<IBaseResponse>{
        try{
            const unlockedFeature = await this.prismaService.unlockedFeature.findFirst({
                where: {
                    userId: userId,
                    featureId: featureId
                },
            })
            if(unlockedFeature){
                throw new BadRequestException("You already have this premium feature")
            }

            const feature = await this.prismaService.feature.findFirstOrThrow({
                where: {
                    id: featureId
                },
                select: {
                    package: {
                        select: {
                            price: true
                        }
                    }
                }
            })

            if(feature.package.price > balance){
                throw new BadRequestException("insufficient balance")
            }

            await this.prismaService.unlockedFeature.create({
                data: {
                    userId: userId,
                    featureId: featureId
                }
            })

            return {
                statusCode: 201,
                message: "Purchaes sucessfully"
            }
        }catch(e){
            this.commonService.catchError(e)
        }
    }
}
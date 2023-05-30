import { BadRequestException, Injectable } from "@nestjs/common";
import { CommonService } from "src/common/common.service";
import { PrismaService } from "src/prisma/prisma.service";
import { DatingStatusEnum } from "src/enums/dating-status.enum";
import { IDatingViewResponse } from "./interfaces/dating-view-response.interface";
import { IBaseResponse } from "src/interfaces/base-response.interface";
import { User } from "@prisma/client";
import { NO_SWIPE_QUOTA_FEATURE_ID } from "src/consts/feature.const";

@Injectable()
export class DatingService{
    constructor(
        private prismaService: PrismaService,
        private commonService: CommonService
    ){}

    async view(seekerId: string, gender: string): Promise<IDatingViewResponse>{
        try{
            const noSwipeQuotaFeature = await this.prismaService.unlockedFeature.findFirst({
                where: {
                    featureId: NO_SWIPE_QUOTA_FEATURE_ID,
                    userId: seekerId
                }
            })
            if(!noSwipeQuotaFeature){
                const [{count}] = await this.prismaService.$queryRawUnsafe<[{count: number}]>(`
                    select count(1) from "Dating" u
                    where u."seekerId" = '${seekerId}'
                    and u."createdAt" = '${new Date().toDateString()}'
                `)
                if(count >= 10){
                    throw new BadRequestException("Your are reached limit of dating profile visits")
                }
            }
            
            const [visitedUser] = await this.prismaService.$queryRawUnsafe<User[]>(`
                select "id", "name", "gender" from "User" u
                where u.id not in (
                    select d."visitedUserId" from "Dating" d
                    where d."createdAt" = '${new Date().toDateString()}'
                    and d."seekerId" = '${seekerId}'
                )
                and u."gender" != '${gender}'
                limit 1
            `)
            if(visitedUser){
                await this.prismaService.dating.create({
                    data: {
                        seekerId: seekerId,
                        visitedUserId: visitedUser.id,
                        status: DatingStatusEnum.VIEWED
                    }
                })
            }

            return {
                statusCode: 200,
                message: "Ok",
                payload: visitedUser
            }
        }catch(e){
            this.commonService.catchError(e)
        }
    }

    async pass(seekerId: string, visitedUserId: string): Promise<IBaseResponse>{
        try{
            await this.prismaService.dating.findFirstOrThrow({
                where: {
                    seekerId: seekerId,
                    visitedUserId: visitedUserId,
                    createdAt: new Date(),
                    status: DatingStatusEnum.VIEWED
                }
            })

            await this.prismaService.dating.update({
                where: {
                    seekerId_visitedUserId_createdAt: {
                        seekerId: seekerId,
                        visitedUserId: visitedUserId,
                        createdAt: new Date()
                    }
                },
                data: {
                    status: DatingStatusEnum.PASSED
                }
            })
            return {
                statusCode: 200,
                message: "Success passed selected user"
            }
        }catch(e){
            this.commonService.catchError(e)
        }
    }

    async like(seekerId: string, visitedUserId: string): Promise<IBaseResponse>{
        try{
            await this.prismaService.dating.findFirstOrThrow({
                where: {
                    seekerId: seekerId,
                    visitedUserId: visitedUserId,
                    createdAt: new Date(),
                    status: DatingStatusEnum.VIEWED
                }
            })

            await this.prismaService.dating.update({
                where: {
                    seekerId_visitedUserId_createdAt: {
                        seekerId: seekerId,
                        visitedUserId: visitedUserId,
                        createdAt: new Date()
                    }
                },
                data: {
                    status: DatingStatusEnum.LIKED
                }
            })
            return {
                statusCode: 200,
                message: "Success passed selected user"
            }
        }catch(e){
            this.commonService.catchError(e)
        }
    }
}
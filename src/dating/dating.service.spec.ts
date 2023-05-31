import { PrismaService } from "../../src/prisma/prisma.service"
import { CommonService } from "../../src/common/common.service"
import { DatingService } from "./dating.service"
import { Test, TestingModule } from "@nestjs/testing"
import { DatingModule } from "./dating.module"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"

describe("DatingService", () => {
    let datingService: DatingService
    let commonService: CommonService
    let prismaService: PrismaService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [
                DatingModule,
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: ".env.testing"
                }),
                JwtModule.registerAsync({
                    global: true,
                    useFactory: (configService: ConfigService) => ({
                        secret: configService.getOrThrow<string>("JWT_SECRET"),
                        signOptions: {
                            expiresIn: configService.getOrThrow<string>("JWT_EXPIRES_IN"),
                        }
                    }),
                    inject: [ConfigService]
                }),
            ]
            }).compile();
    
            datingService = app.get<DatingService>(DatingService);
            commonService = app.get<CommonService>(CommonService)
            prismaService = app.get<PrismaService>(PrismaService)

            await prismaService.user.createMany({
                data: [
                    {
                        email: "alex@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "Alex",
                        gender: "MALE"
                    },
                    {
                        email: "mawar@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "Mawar",
                        gender: "FEMALE"
                    },
                    {
                        email: "tiara@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "Tiara",
                        gender: "FEMALE"
                    },
                    {
                        email: "nia@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "Nia",
                        gender: "FEMALE"
                    },
                    {
                        email: "laras@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "Laras",
                        gender: "FEMALE"
                    },
                    {
                        email: "ziva@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "Ziva",
                        gender: "FEMALE"
                    },
                    {
                        email: "Ningsih@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "Ningsih",
                        gender: "FEMALE"
                    },
                    {
                        email: "Bella@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "Bella",
                        gender: "FEMALE"
                    },
                    {
                        email: "nabila@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "nabila",
                        gender: "FEMALE"
                    },
                    {
                        email: "salma@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "salma",
                        gender: "FEMALE"
                    },
                    {
                        email: "zahra@gmail.com",
                        password: await commonService.hashPassword("!Password123"),
                        name: "Zahra",
                        gender: "FEMALE"
                    },
                ],
                skipDuplicates: true
            })
    })

    describe("view", () => {
        it("view other profile should return 200", async () => {
            const user = await prismaService.user.findUnique({
                where: {
                    email: "alex@gmail.com"
                },
                select: {
                    id: true,
                    gender: true
                }
            })
            const response = await datingService.view(user.id, user.gender)
            expect(response.statusCode).toBe(200)
        })
    })

    afterAll(async () => {
        await prismaService.dating.deleteMany()
        await prismaService.user.deleteMany()
        await prismaService.$disconnect()
    })
})
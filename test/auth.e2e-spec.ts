import { ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { Test, TestingModule } from "@nestjs/testing";
import { CommonService } from "../src/common/common.service";
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthModule } from "../src/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";


describe("Auth Module E2E Testing", () => {
    let app: NestFastifyApplication;
    let prismaService: PrismaService
    let commonService: CommonService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AuthModule,
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
		})
        .compile();

        app = module.createNestApplication<NestFastifyApplication>(
            new FastifyAdapter(),
        );
        app.useGlobalPipes(new ValidationPipe({
            disableErrorMessages: false // change to true in production
          }));
        await app.init();
        await app.getHttpAdapter().getInstance().ready();

        commonService = module.get<CommonService>(CommonService)
        prismaService = module.get<PrismaService>(PrismaService)
        
        await prismaService.user.createMany({
            data: [
                {
                    email: "mawar@gmail.com",
                    password: await commonService.hashPassword("!Password123"),
                    name: "Mawar",
                    gender: "FEMALE"
                }
            ],
            skipDuplicates: true
        })
    })

    it("POST /auth/login", async () => {
        return app
            .inject({
                method: "POST",
                url: "/auth/login",
                payload: {
                    email: "mawar@gmail.com",
                    password: "!Password123"
                }
            }).then(result => {
                expect(result.statusCode).toEqual(201);
            })
    })

    it("POST /auth/sign-up", async () => {
        return app
            .inject({
                method: "POST",
                url: "/auth/sign-up",
                payload: {
                    email: "alex@gmail.com",
                    password: "!Password123",
                    name: "Alex",
                    gender: "MALE"
                }
            }).then(result => {
                expect(result.statusCode).toEqual(201);
            })
    })

    it("GET /auth/profile", async () => {
        const result = await app.inject({
                method: "POST",
                url: "/auth/login",
                payload: {
                    email: "mawar@gmail.com",
                    password: "!Password123"
                }
        })
        const {payload: {accessToken}} = JSON.parse(result.payload)
        
        return app
            .inject({
                method: "GET",
                url: "/auth/profile",
                headers: {
                    authorization: "Bearer " + accessToken
                }
            }).then(result => {
                const {payload: {isVerified}} = JSON.parse(result.payload)
                expect(result.statusCode).toEqual(200);
                expect(isVerified).toBe(false)
            })
    })

    afterAll(async () => {
        await prismaService.unlockedFeature.deleteMany()
        await prismaService.user.deleteMany()
        await prismaService.$disconnect()
    })
})
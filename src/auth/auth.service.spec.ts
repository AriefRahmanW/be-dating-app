import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { CommonService } from '../../src/common/common.service';
import { GenderEnum } from '../../src/enums/gender.enum';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { NO_SWIPE_QUOTA_FEATURE_ID, VERIFIED_LABEL_FEATURE_ID } from '../../src/consts/feature.const';

describe('AppService', () => {
    let authService: AuthService
    let commonService: CommonService
    let prismaService: PrismaService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
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
        }).compile();

        authService = app.get<AuthService>(AuthService);
        commonService = app.get<CommonService>(CommonService)
        prismaService = app.get<PrismaService>(PrismaService)
        
        await prismaService.user.createMany({
            data: [
                {
                    email: "jhondoe@gmail.com",
                    password: await commonService.hashPassword("!Password123"),
                    name: "Jhon Doe",
                    gender: "MALE"
                },
                {
                    email: "mawar@gmail.com",
                    password: await commonService.hashPassword("!Password123"),
                    name: "Mawar",
                    gender: "FEMALE"
                },
            ],
            skipDuplicates: true
        })

        const premiumPackage = await prismaService.package.upsert({
            where: {
                id: "8ec9509b-477f-4aad-98e5-215d3f232ef0"
            },
            create: {
                type: "PREMIUM",
                price: 50000
            },
            update: {}
        })
    
        await prismaService.feature.createMany({
            data: [
                {
                    id: NO_SWIPE_QUOTA_FEATURE_ID,
                    name: "No swipe quota",
                    packageId: premiumPackage.id
                },
                {
                    id: VERIFIED_LABEL_FEATURE_ID,
                    name: "Verified label",
                    packageId: premiumPackage.id
                }
            ],
            skipDuplicates: true
        })
    });


    describe('login', () => {
        it('should return 201', async () => {
            
            const response = await authService.login({
                email: "mawar@gmail.com",
                password: "!Password123"
            })
            expect(response.statusCode).toBe(201);
        });
        it('should return BadRequestException', async () => {
            await authService.login({
                email: "johndoe@gmail.com",
                password: "!Password1237"
            }).catch(e => {
                expect(e).toBeInstanceOf(BadRequestException)
            })
            
        });
    });

    describe("sign-up", () => {
        
        it('should return BadRequestException', async () => {
            await authService.signUp({
                email: "johndoe@gmail.com",
                name: "John Doe",
                password: await commonService.hashPassword("!Password1234"),
                gender: GenderEnum.MALE
            }).catch(e => {
                expect(e).toBeInstanceOf(BadRequestException)
            })
        })
        it('should return 201', async () => {
            const suffix = randomBytes(5).toString("hex")
            const response = await authService.signUp({
                email: `user_${suffix}@gmail.com`,
                name: `User ${suffix}`,
                password: await commonService.hashPassword("!Password1234"),
                gender: GenderEnum.MALE
            })
            expect(response.statusCode).toBe(201);
        })
    })

    describe("profile", () => {
        it("user not purchaesed verified label feature should return 200 and isVerified = false", async () => {
            const user = await prismaService.user.findUnique({
                where: {
                    email: "mawar@gmail.com"
                },
                select: {
                    id: true
                }
            })
            const response = await authService.profile(user.id)
            expect(response.statusCode).toBe(200);
            expect(response.payload.isVerified).toBe(false)
        })
        it("user purchaesed verified label feature should return 200 and isVerified = false", async () => {
            const user = await prismaService.user.findUnique({
                where: {
                    email: "johndoe@gmail.com"
                },
                select: {
                    id: true
                }
            })
            await prismaService.unlockedFeature.create({
                data: {
                    userId: user.id,
                    featureId: VERIFIED_LABEL_FEATURE_ID
                }
            })
            const response = await authService.profile(user.id)
            expect(response.statusCode).toBe(200);
            expect(response.payload.isVerified).toBe(true)
        })
    })

    afterAll(async () => {
        await prismaService.unlockedFeature.deleteMany()
        await prismaService.feature.deleteMany()
        await prismaService.package.deleteMany()
        await prismaService.user.deleteMany()
        await prismaService.$disconnect()
    })
});

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { CommonModule } from "src/common/common.module";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        PrismaModule,
        CommonModule
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule{}
import { Module } from "@nestjs/common";
import { PrismaModule } from "../../src/prisma/prisma.module";
import { DatingController } from "./dating.controller";
import { DatingService } from "./dating.service";
import { CommonModule } from "../../src/common/common.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        PrismaModule,
        CommonModule,
        JwtModule
    ],
    controllers: [DatingController],
    providers: [DatingService]
})
export class DatingModule{}
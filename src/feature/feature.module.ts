import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { FeatureController } from "./feature.controller";
import { FeatureService } from "./feature.service";

@Module({
    imports: [
        PrismaModule,
        CommonModule
    ],
    controllers: [FeatureController],
    providers: [FeatureService]
})
export class FeatureModule{}
import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { PurchaesController } from "./purchase.controller";
import { PurchaseService } from "./purchase.service";

@Module({
    imports: [
        PrismaModule,
        CommonModule
    ],
    controllers: [PurchaesController],
    providers: [PurchaseService]
})
export class PurchaseModule{}
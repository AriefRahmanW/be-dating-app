import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { PurchaesController } from "./purchaes.controller";
import { PurchaesService } from "./purchaes.service";

@Module({
    imports: [
        PrismaModule,
        CommonModule
    ],
    controllers: [PurchaesController],
    providers: [PurchaesService]
})
export class PurchaesModule{}
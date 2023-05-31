import { Controller, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("purchases")
export class PurchaesController{
    constructor(
        private purchaseService: PurchaseService
    ){}
    
    @UseGuards(AuthGuard)
    @Post()
    addPurchaes(
        @Req() req,
        @Query("featureId") featureId: string,
        @Query("balance", ParseIntPipe) balance: number 
    ){
        const {id} = req.user
        return this.purchaseService.addPurchaes(id, featureId, balance)
    }
}
import { Controller, ParseIntPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { PurchaesService } from "./purchaes.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("purchaeses")
export class PurchaesController{
    constructor(
        private purchaesService: PurchaesService
    ){}
    
    @UseGuards(AuthGuard)
    @Post()
    addPurchaes(
        @Req() req,
        @Query("featureId") featureId: string,
        @Query("balance", ParseIntPipe) balance: number 
    ){
        const {id} = req.user
        return this.purchaesService.addPurchaes(id, featureId, balance)
    }
}
import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { FeatureService } from "./feature.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('features')
export class FeatureController{
    constructor(
        private featureService: FeatureService
    ){}

    @UseGuards(AuthGuard)
    @Get()
    getAllFeatures(
        @Query("packagedId") packageId: string
    ){
        return this.featureService.getAll(packageId)
    }
}
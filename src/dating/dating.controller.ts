import { Controller, Get, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { DatingService } from "./dating.service";

@Controller("datings")
export class DatingController{

    constructor(
        private datingService: DatingService
    ){}

    // @UseGuards(AuthGuard)
    // @Get()
    // search(
    //     @Req() req
    // ){
    //     const {id, gender} = req.user
    //     return this.datingService.search(id, gender)
    // }

    @UseGuards(AuthGuard)
    @Get()
    view(
        @Req() req
    ){
        const {id, gender} = req.user
        return this.datingService.view(id, gender)
    }

    @UseGuards(AuthGuard)
    @Put("pass")
    pass(
        @Req() req,
        @Query("visitedUserId") visitedUserId: string
    ){
        const {id} = req.user
        return this.datingService.pass(id, visitedUserId)
    }

    @UseGuards(AuthGuard)
    @Put("like")
    like(
        @Req() req,
        @Query("visitedUserId") visitedUserId: string
    ){
        const {id} = req.user
        return this.datingService.like(id, visitedUserId)
    }
}
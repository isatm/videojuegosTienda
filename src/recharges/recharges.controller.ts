import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RechargesService } from './recharges.service';
import { CreateRechargeDto } from './dto/recharge.dto';

@Controller('recharges')
export class RechargesController {

    constructor(private readonly rechargesService: RechargesService) {}

    @UseGuards(JwtAuthGuard)
    @Post(':cardId')
    changePassword(@Param('cardId') cardId: string, @Body() createRechargeDto: CreateRechargeDto,  @Request() req) {
        const userId = req.user.id;
        return this.rechargesService.create(createRechargeDto, userId, cardId);
    }
}

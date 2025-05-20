import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { RegisterCardDto } from './dto/card.dto';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async register(@Body() registerCardDto: RegisterCardDto, @Request() req) {
        const userId = req.user.id;
        return await this.cardsService.register(registerCardDto, userId);
    }
}

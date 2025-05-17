import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/game.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() createGameDto: CreateGameDto, 
        @Request() req) {
        const userId = req.user.id;
        return await this.gamesService.create(createGameDto, userId);
    }
}

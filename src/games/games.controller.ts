import { Body, Controller, Param, Patch, Post, Put, Request, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(
        @Body() createGameDto: CreateGameDto, @Request() req) {
        const userId = req.user.id;
        return await this.gamesService.create(createGameDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto, @Request() req) {
        const userId = req.user.id;
        return this.gamesService.update(updateGameDto, id, userId);
    }
}

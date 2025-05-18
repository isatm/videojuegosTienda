import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game as SchemaGame, GameDocument } from './schema/game.schema';
import mongoose, { Model } from 'mongoose';
import { Game, GameServiceInterface } from './interfaces/game.interface';
import { CreateGameDto } from './dto/game.dto';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class GamesService implements GameServiceInterface {
    constructor(
        @InjectModel(SchemaGame.name) private gameModel: Model<GameDocument>,
        private usersService: UsersService
      ) {}
    
    private toGameInterface(gameDoc: GameDocument): Game {
        const gameObj = gameDoc.toObject();
        gameObj.id = gameObj._id.toString();
        delete gameObj._id;
        delete gameObj.__v;
        delete gameObj.earnings;
        return gameObj as Game;
    }

    async create(createGameDto: CreateGameDto, creatorId: string): Promise<Game> {
        //User exception
        const user = await this.usersService.findOne(creatorId); 
        if (!user) {
            throw new NotFoundException('User not founded');
        }
        
        //Date exception
        if (createGameDto.release < new Date()) {
            throw new BadRequestException('Invalid Date.');
        }

        //Create game
        const newGame = new this.gameModel({
            ...createGameDto,
            creatorId: (await user)._id
        });

        //Add game in "gamesPublished"
        const savedGame = await newGame.save();
        const updatedGames = [...((await user).gamesPublished || []), savedGame._id];
        await this.usersService.update(creatorId, {
            gamesPublished: updatedGames as mongoose.Schema.Types.ObjectId[],
        });

        return this.toGameInterface(savedGame);
    }

    async findOne(id: string): Promise<Game> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException('ID invalid');
    }
    const game = await this.gameModel.findById(id).exec();
    if (!game) {
      throw new NotFoundException(`Game with ID "${id}" not found`);
    }
    return this.toGameInterface(game);
    }
}

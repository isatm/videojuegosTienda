import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game as SchemaGame, GameDocument } from './schema/game.schema';
import mongoose, { isValidObjectId, Model, Types } from 'mongoose';
import { Game, GameServiceInterface } from './interfaces/game.interface';
import { CreateGameDto, UpdateGameDto } from './dto/game.dto';
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
        if (createGameDto.release && createGameDto.release < new Date()) {
            throw new BadRequestException('Invalid Date.');
        }

        //Create game
        const newGame = new this.gameModel({
            ...createGameDto,
            creatorId: creatorId
        });

        //Add game in "gamesPublished"
        const savedGame = await newGame.save();
        const updatedGames = [...((await user).gamesPublished || []), savedGame._id];
        await this.usersService.update(creatorId, {
            gamesPublished: updatedGames as mongoose.Schema.Types.ObjectId[],
        });

        return this.toGameInterface(savedGame);
    }

    async update(updateGameDto: UpdateGameDto, gameId: string, userId: string): Promise<Game> {
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new BadRequestException('Invalid game ID.');
        }

        //GameNotFoundException
        const game = await this.gameModel.findById(gameId).exec();
        if (!game) {
            throw new NotFoundException(`Game with ID "${gameId}" not found.`);
        }

        //TheUserIsTheAuthorException
        if (game.creatorId.toString() !== userId.toString()) {
            throw new ForbiddenException('You are not the author of this game');
        }

        //DateException
        if (updateGameDto.release && updateGameDto.release < new Date()) {
            throw new BadRequestException('Invalid release date.');
        }

        const updatedGame = await this.gameModel.findByIdAndUpdate(gameId, updateGameDto, {
            new: true,            
            runValidators: true,  
        });

        //ValidationUpdate
        if (!updatedGame) {
            throw new NotFoundException(`Game with ID "${gameId}" not found after update.`);
        }

        return this.toGameInterface(updatedGame);
    }

    async incrementDownloadsAndEarnings(gameId: string, amount: number): Promise<void> {

        if (!isValidObjectId(gameId)) {
            throw new BadRequestException(`Invalid game ID: ${gameId}`);
        }

        const result = await this.gameModel.findByIdAndUpdate(
        new Types.ObjectId(gameId),
        { $inc: { downloads: 1, earnings: amount } },
        { new: true },
        ).exec();
        if (!result) {
            throw new NotFoundException(`Game with ID ${gameId} not found`);
        }
    }

    async findById(gameId: string): Promise<Game> {
        if (!isValidObjectId(gameId)) {
        throw new BadRequestException(`Invalid game ID: ${gameId}`);
        }
        const game = await this.gameModel.findById(gameId).exec();
        if (!game) {
        throw new NotFoundException(`Game with ID ${gameId} not found`);
        }
        return this.toGameInterface(game);
    }
}

import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schema/game.schema';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
      UsersModule,
  ],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}

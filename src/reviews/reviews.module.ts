import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';
import { UsersModule } from 'src/users/user.module';
import { GamesModule } from 'src/games/games.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
        UsersModule,
        GamesModule,
    ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
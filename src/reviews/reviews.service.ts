import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Review, ReviewServiceInterface } from './interfaces/review.interface';
import { CreateReviewDTO, UpdateReviewDTO } from './dto/review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review as schemaReview, reviewDocument } from './schema/review.schema';
import { GamesService } from 'src/games/games.service';
import { UsersService } from 'src/users/user.service';
import { Model } from 'mongoose';
@Injectable()
export class ReviewsService implements ReviewServiceInterface{
    constructor(
        @InjectModel(schemaReview.name) private readonly  reviewModel: Model<reviewDocument>,
        private usersService: UsersService,
        private gameService: GamesService
    ){}

    private toReviewInterface(reviewDoc: reviewDocument): Review {
        const reviewObj = reviewDoc.toObject();
        reviewObj.id = reviewObj._id.toString();
        delete reviewObj._id;
        delete reviewObj.__v;
        delete reviewObj.earnings;
        return reviewObj as Review;
    }
    async create(createReviewDTO: CreateReviewDTO, authorId: string, gameId: string): Promise<Review> {
        const user = await this.usersService.findOne(authorId);
        const game = await this.gameService.findOne(gameId);

        if (!user) {
              throw new NotFoundException('User not founded');
        }

        if (!game) {
              throw new NotFoundException('Game not founded');
        }

        //Date exception
        /*
        if (createReviewDTO.review_date < new Date()) {
                    throw new BadRequestException('Invalid Date.');
        }
*/
        const newReview = new this.reviewModel({
            ...createReviewDTO,
            authorId: user.id,
            gameId: game.id
        })

        const savedReview = await newReview.save();
        
        return this.toReviewInterface(savedReview);

    }
    async update(updateReviewDTO: UpdateReviewDTO, authorId: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
}

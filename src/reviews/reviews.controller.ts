import { Body, Controller, Post, UseGuards, Request, Param} from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { ReviewsService } from './reviews.service';
import { CreateReviewDTO } from './dto/review.dto';
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}
    
    @UseGuards(JwtAuthGuard)
    @Post("score/:id")
    async create(
        @Body() createReviewDTO: CreateReviewDTO,
        @Param('id') gameId: string,
        @Request() req){
            const userId= req.user.id;
            return await this.reviewsService.create(createReviewDTO, userId, gameId);
        }
}

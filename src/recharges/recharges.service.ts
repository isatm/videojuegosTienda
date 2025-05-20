import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Recharge, RechargeServiceInterface } from './interfaces/recharge.interface';
import { Model, Types } from 'mongoose';
import { Recharge as SchemaRecharge, RechargeDocument } from './schema/recharge.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRechargeDto } from './dto/recharge.dto';
import { UsersService } from 'src/users/user.service';
import { CardsService } from 'src/cards/cards.service';

@Injectable()
export class RechargesService implements RechargeServiceInterface {
    constructor(
        @InjectModel(SchemaRecharge.name) private rechargeModel: Model<RechargeDocument>,
            private usersService: UsersService,
            private cardsService: CardsService
        ) {}
    
    private toRechargeInterface(rechargeDoc: RechargeDocument): Recharge {
        const rechargeObj = rechargeDoc.toObject();
        rechargeObj.id = rechargeObj._id.toString();
        delete rechargeObj._id;
        delete rechargeObj.__v;
        delete rechargeObj.earnings;
        return rechargeObj as Recharge;
    }

    async create(createRechargeDto: CreateRechargeDto, userId: string, cardId: string): Promise<Recharge> {
        const user = await this.usersService.findOne(userId);
        if (!user) throw new NotFoundException('User not founded');
        
        const purchasedCoins = createRechargeDto.purchasedCoins
        if(purchasedCoins < 0){
            throw new BadRequestException("You can't recharge negative coins");
        }

        const card = await this.cardsService.findById(cardId); 
        if (!card) throw new NotFoundException('Card not founded');

        if (card.userId.toString() !== userId) {
            throw new ForbiddenException('This card does not belong to this user');
        }


        const rechargeDoc = new this.rechargeModel({
        userId: new Types.ObjectId(userId),
        cardId: new Types.ObjectId(cardId),
        purchasedCoins: createRechargeDto.purchasedCoins,
        });
        const saved = await rechargeDoc.save();

        user.balance += createRechargeDto.purchasedCoins;
        await this.usersService.recharge(userId, createRechargeDto.purchasedCoins);

        return this.toRechargeInterface(saved);
    }
}

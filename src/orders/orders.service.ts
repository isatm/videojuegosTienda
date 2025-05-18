import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order as SchemaOrder, OrderDocument } from './schema/order.schema';
import { CreateOrderDto } from './dto/order.dto';
import { UsersService } from 'src/users/user.service';
import { GamesService } from 'src/games/games.service';
import { Order, OrderServiceInterface } from './interfaces/order.inteface';

@Injectable()
export class OrdersService implements OrderServiceInterface{
  constructor(
    @InjectModel(SchemaOrder.name) private orderModel: Model<OrderDocument>,
    private usersService: UsersService,
    private gamesService: GamesService,
  ) {}

    private toOrderInterface(orderDoc: OrderDocument): Order {
        const orderObj = orderDoc.toObject();
        orderObj.id = orderObj._id.toString();
        delete orderObj.password;
        delete orderObj._id;
        delete orderObj.__v;
        return orderObj as Order;
    }

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const game = await this.gamesService.findById(createOrderDto.gameId);
    if (!game) throw new NotFoundException('Game not found');

    if (user.gamesPurchased?.includes(game._id)) {
      throw new BadRequestException('Game already purchased');
    }

    if (user.balance < game.price) {
      throw new BadRequestException('Insufficient balance');
    }

    await this.usersService.recharge(userId, -game.price);

    await this.gamesService.incrementDownloadsAndEarnings(createOrderDto.gameId, game.price);

    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      gameId: new Types.ObjectId(createOrderDto.gameId),
      price: game.price,
    });

    await this.usersService.addPurchasedGame(userId, createOrderDto.gameId);

    return this.toOrderInterface(order);
  }
}

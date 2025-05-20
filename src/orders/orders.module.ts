import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schema/order.schema';
import { UsersModule } from 'src/users/user.module';
import { GamesModule } from 'src/games/games.module';
import { OrdersService } from './orders.service';

@Module({
  imports: [
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
        UsersModule,
        GamesModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}

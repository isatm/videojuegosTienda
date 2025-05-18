import { Module } from '@nestjs/common';
import { RechargesController } from './recharges.controller';
import { RechargesService } from './recharges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recharge, RechargeSchema } from './schema/recharge.schema';
import { UsersModule } from 'src/users/user.module';
import { CardsModule } from 'src/cards/cards.module';

@Module({
  imports: [
        MongooseModule.forFeature([{ name: Recharge.name, schema: RechargeSchema }]),
        UsersModule,
        CardsModule
  ],
  controllers: [RechargesController],
  providers: [RechargesService]
})
export class RechargesModule {}

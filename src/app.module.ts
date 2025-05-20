import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/user.module';
import { GamesModule } from './games/games.module';
import { RechargesModule } from './recharges/recharges.module';
import { CardsModule } from './cards/cards.module';
import { CryptoService } from './crypto/crypto.service';
import { CryptoModule } from './crypto/crypto.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    UsersModule,
    GamesModule,
    RechargesModule,
    CardsModule,
    CryptoModule,
    OrdersModule,
    ReviewsModule,
  ],
  providers: [CryptoService],
})
export class AppModule {}
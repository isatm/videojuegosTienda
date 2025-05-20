import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/order.dto';

@Controller('orders')
export class OrdersController {

    constructor(private readonly ordersService: OrdersService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createOrderDto: CreateOrderDto,  @Request() req) {
        const userId = req.user.id;
        return this.ordersService.create(userId, createOrderDto);
    }
}

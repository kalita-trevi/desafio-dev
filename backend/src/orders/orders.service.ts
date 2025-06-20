import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductsService } from '../products/products.service';

interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  items: { productId: string; provider: string; quantity: number }[];
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async create(body: CreateOrderDto) {
    const { customerName, customerEmail, items } = body;
    if (!items || !items.length) throw new Error('Carrinho vazio');
    // Buscar detalhes dos produtos
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const product = await this.productsService.findOne(item.provider, item.productId);
        return {
          productId: item.productId,
          provider: item.provider,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: item.quantity,
        };
      })
    );
    const total = detailedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await this.prisma.order.create({
      data: {
        customerName,
        customerEmail,
        total,
        items: {
          create: detailedItems,
        },
      },
      include: { items: true },
    });
    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
  }
}

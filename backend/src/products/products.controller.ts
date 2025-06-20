import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('provider') provider?: string) {
    return this.productsService.findAll(provider);
  }

  @Get(':provider/:id')
  findOne(@Param('provider') provider: string, @Param('id') id: string) {
    return this.productsService.findOne(provider, id);
  }
}

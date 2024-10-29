import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateProductDto, UpdateProductDto } from "./products.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(":id/auctions")
  findAuctions(@Param("id") id: string) {
    return this.productsService.findAuctions(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }

  @Get("search/:query")
  search(@Param("query") query: string) {
    return this.productsService.search(query);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
}

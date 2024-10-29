import { Module } from "@nestjs/common";

import { ProductImagesController } from "./images.controller";
import { ProductImagesService } from "./images.service";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
  controllers: [ProductsController, ProductImagesController],
  providers: [ProductsService, ProductImagesService],
})
export class ProductsModule {}

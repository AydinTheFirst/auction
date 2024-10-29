import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

import { Roles } from "@/common/decorators";
import { Role } from "@/prisma";

import { ProductImagesService } from "./images.service";

@Controller("products/:productId/images")
@Roles([Role.ADMIN])
export class ProductImagesController {
  constructor(private imagesService: ProductImagesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor("images"))
  create(
    @Param("productId") productId: string,
    @UploadedFiles() images: Express.Multer.File[]
  ) {
    return this.imagesService.uploadImages(productId, images);
  }

  @Delete(":image")
  remove(@Param("productId") productId: string, @Param("image") image: string) {
    return this.imagesService.deleteImage(productId, image);
  }

  @Patch()
  update(
    @Param("productId") productId: string,
    @Body("images") images: string[]
  ) {
    return this.imagesService.updateImages(productId, images);
  }
}

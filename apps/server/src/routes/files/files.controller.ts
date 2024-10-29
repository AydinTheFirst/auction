import { Controller, Get, NotFoundException, Param, Res } from "@nestjs/common";
import { Response } from "express";

import { AWS } from "@/lib/aws";

@Controller("files")
export class FilesController {
  @Get(":key")
  async findOne(@Param("key") key: string, @Res() res: Response) {
    const file = await AWS.getFile(key);

    if (!file) {
      throw new NotFoundException("File not found");
    }

    if (!file.Body) {
      throw new NotFoundException("File not found");
    }

    res.set({
      "Content-Length": file.ContentLength,
      "Content-Type": file.ContentType,
      //"Content-Disposition": `attachment; filename="${key}"`, // Makes the browser download the file
    });

    const fileStream = file.Body as NodeJS.ReadableStream;
    fileStream.pipe(res);
  }
}

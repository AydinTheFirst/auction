import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import argon from "argon2";
import tckimlikno from "tckimlikno";

import { PrismaService } from "@/prisma";

import { LoginDto, RegisterDto } from "./auth.dto";

@Injectable()
export class AuthService {
  login = async (body: LoginDto) => {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.username }],
      },
    });

    if (!user) throw new NotFoundException("Kullanıcı bulunamadı");

    if (!user.password) {
      user.password = await argon.hash(body.password);
      await this.prisma.user.update({
        data: {
          password: await argon.hash(body.password),
        },
        where: {
          id: user.id,
        },
      });
    }

    const isValid = await argon.verify(user.password, body.password);
    if (!isValid) throw new BadRequestException("Şifre yanlış");

    const token = await this.prisma.token.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
        userId: user.id,
      },
    });

    return {
      ...user,
      token: token.token,
    };
  };

  register = async (body: RegisterDto) => {
    const isExist = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (isExist) {
      throw new BadRequestException(
        "Bu kullanıcı adı veya email zaten kullanılıyor"
      );
    }

    const verifyCitizen = tckimlikno({
      ad: body.firstName,
      dogum_yili: new Date(body.birthDate).getFullYear(),
      soyad: body.lastName,
      tc: +body.nationalId,
    });

    if (!verifyCitizen) {
      throw new BadRequestException("T.C. Kimlik numarası doğrulanamadı");
    }

    const hashedPassword = await argon.hash(body.password);

    const user = this.prisma.user.create({
      data: {
        ...body,
        birthDate: new Date(body.birthDate),
        password: hashedPassword,
      },
    });

    return user;
  };

  constructor(private prisma: PrismaService) {}
}

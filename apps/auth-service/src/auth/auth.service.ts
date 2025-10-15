import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const { email, username, password } = dto;

    const exists = await this.users.findOne({ where: [{ email }, { username }] });
    if (exists) {
      throw new ConflictException('Email or username already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.users.create({ email, username, passwordHash });
    await this.users.save(user);

    return this.issueTokens(user.id, user.username, user.email);
  }

  async login(dto: LoginDto) {
    const { identifier, password } = dto;
    const user = await this.users.findOne({
      where: [{ email: identifier }, { username: identifier }]
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.issueTokens(user.id, user.username, user.email);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });
      return this.issueTokens(payload.sub, payload.username, payload.email);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private issueTokens(userId: string, username: string, email: string) {
    const accessTtl = Number(process.env.JWT_ACCESS_TTL || 900);
    const refreshTtl = Number(process.env.JWT_REFRESH_TTL || 604800);

    const accessToken = this.jwt.sign(
      { sub: userId, username, email, type: 'access' },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: accessTtl }
    );

    const refreshToken = this.jwt.sign(
      { sub: userId, username, email, type: 'refresh' },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: refreshTtl }
    );

    return { accessToken, refreshToken };
  }
}

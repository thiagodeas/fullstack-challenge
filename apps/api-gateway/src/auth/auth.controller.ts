import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthProxyService } from './auth.proxy.service';
import { JwtTokensDto, LoginDto, RefreshDto, RegisterDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthProxyService) {}

  @Post('register')
  @ApiOperation({ summary: 'Cadastro de usuário' })
  @ApiOkResponse({ type: JwtTokensDto })
  async register(@Body() dto: RegisterDto): Promise<JwtTokensDto> {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login do usuário' })
  @ApiOkResponse({ type: JwtTokensDto })
  async login(@Body() dto: LoginDto): Promise<JwtTokensDto> {
    return this.auth.login(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renova o access token a partir do refresh token' })
  @ApiOkResponse({ type: JwtTokensDto })
  async refresh(@Body() dto: RefreshDto): Promise<JwtTokensDto> {
    return this.auth.refresh(dto);
  }
}

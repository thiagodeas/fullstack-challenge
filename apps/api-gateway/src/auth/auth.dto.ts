import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'janedoe' })
  @IsString()
  @MinLength(3)
  username!: string;

  @ApiProperty({ minLength: 6, example: 's3cret!' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ description: 'Email ou username', example: 'jane.doe@example.com' })
  @IsString()
  identifier!: string; // email or username

  @ApiProperty({ minLength: 6, example: 's3cret!' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class RefreshDto {
  @ApiProperty({ description: 'Refresh token JWT' })
  @IsNotEmpty()
  refreshToken!: string;
}

export class JwtTokensDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}

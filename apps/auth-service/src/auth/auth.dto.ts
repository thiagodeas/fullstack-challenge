import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  username!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class LoginDto {
  @IsString()
  identifier!: string; // email or username

  @IsString()
  @MinLength(6)
  password!: string;
}

export class RefreshDto {
  @IsNotEmpty()
  refreshToken!: string;
}

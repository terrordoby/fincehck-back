import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticateDto } from './dto/authenticate.dto';
import { UsersRepository } from 'src/shared/repositories/users.repository';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  async authenticate(authenticateDto: AuthenticateDto) {
    const { email, password } = authenticateDto;
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const acessToken = await this.jwtService.signAsync({ sub: user.id });

    return { acessToken };
  }
}

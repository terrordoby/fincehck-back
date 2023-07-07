import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcryptjs';
import { UsersRepository } from 'src/shared/repositories/users.repository';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const emailTaken = await this.userRepository.findByEmail(
      createUserDto.email,
    );

    if (emailTaken) {
      throw new ConflictException('This email is already in use');
    }

    const passwordHash = await hash(createUserDto.password, 12);

    const user = await this.userRepository.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: passwordHash,
        category: {
          createMany: {
            data: [
              { name: 'Salário', icon: 'travel', type: 'INCOME' },
              { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
              { name: 'Casa', icon: 'home', type: 'EXPENSE' },
              { name: 'Alimentação', icon: 'food', type: 'EXPENSE' },
              { name: 'Educação', icon: 'education', type: 'EXPENSE' },
              { name: 'Lazer', icon: 'fun', type: 'EXPENSE' },
              { name: 'Mercado', icon: 'grocery', type: 'EXPENSE' },
              { name: 'Roupas', icon: 'clothes', type: 'EXPENSE' },
              { name: 'Transporte', icon: 'transport', type: 'EXPENSE' },
              { name: 'Viagem', icon: 'travel', type: 'EXPENSE' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
            ],
          },
        },
      },
    });

    const acessToken = await this.jwtService.signAsync({ sub: user.id });

    return {
      acessToken,
    };
  }

  getUserById(userId: string) {
    return userId;
  }
}

import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async ensureUnique(
    fields: Partial<Pick<User, 'userName' | 'email'>>,
    excludeId?: string,
  ) {
    const entries = Object.entries(fields).filter(
      ([, value]) => value !== undefined,
    );

    for (const [field, value] of entries) {
      const existing = await this.userRepository.findOne({
        where: { [field]: value } as FindOptionsWhere<User>,
      });
      if (existing && existing.id !== excludeId) {
        throw new ConflictException(`${field} "${value}" is aleady in use`);
      }
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { userName, email, password } = createUserDto;

    await this.ensureUnique({ userName, email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      userName,
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(where: FindOptionsWhere<User>) {
    return this.userRepository.findOne({ where });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findBySelector({ id });

    await this.ensureUnique({ userName: updateUserDto.userName }, id);

    await this.userRepository.update(id, updateUserDto);

    return this.findBySelector({ id });
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async findBySelector(where: FindOptionsWhere<User>) {
    const user = await this.findOne(where);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
}

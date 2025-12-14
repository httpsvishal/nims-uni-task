import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('User already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    return this.userModel.create({
      email: dto.email,
      password: hashed,
    });
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update.user.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.access_key = crypto.randomBytes(7).toString('hex');
    createUserDto.secret_access_token_id = crypto
      .randomBytes(16)
      .toString('hex');

    const createdUser = await this.userModel.create(createUserDto);

    console.log(createUserDto);

    return createdUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();

    console.log(users);

    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user) return null;

    console.log(user);

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user) return null;

    user.name = data.name ?? user.name;
    user.email = data.email ?? user.email;
    user.project = data.project ?? user.project;

    user.save();

    console.log(user);

    return user;
  }

  async delete(id: string) {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user) return null;

    await this.userModel.deleteOne({ _id: id }).exec();

    return true;
  }
}

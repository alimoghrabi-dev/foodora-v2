import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dtos/register.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { LoginUserDto } from './dtos/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async registerNewUser(registerUserDto: RegisterUserDto) {
    try {
      const { firstName, lastName, email, password } = registerUserDto;

      const exists = await this.userModel.findOne({ email }).lean();

      if (exists) throw new ConflictException('User already exists');

      const hashed = await bcrypt.hash(password, 12);

      await this.userModel.create({
        firstName,
        lastName,
        email,
        password: hashed,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async login(loginDto: LoginUserDto) {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email: email });

      if (!user) throw new UnauthorizedException('Invalid credentials');

      const match = await bcrypt.compare(password, user.password);

      if (!match) throw new UnauthorizedException('Invalid credentials');

      return this.generateTokens(user._id as string);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to login user');
    }
  }

  async generateTokens(userId: string) {
    const payload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '7d',
    });

    return { accessToken };
  }
}

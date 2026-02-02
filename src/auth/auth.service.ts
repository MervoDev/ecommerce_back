import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(registerDto: { email: string; password: string; firstName?: string; lastName?: string }) {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    // Créer l'utilisateur
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...result } = user;
    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  async login(loginDto: { email: string; password: string }) {
    // Trouver l'utilisateur
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...result } = user;
    return {
      message: 'Login successful',
      user: result,
    };
  }
}

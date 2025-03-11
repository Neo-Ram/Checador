import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) {}

    @Get()
    async GetAllUsers() {
        return this.userService.getAllUsers();
    }

    @Post()
    async createusers(
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('role') role: string
    ) {
        if (!email || !password || !role) {
            throw new Error('Los campos "email", "password" y "role" son obligatorios');
        }
        return this.userService.createuser(email, password, role);
    }
}
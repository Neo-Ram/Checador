import { Controller, Get, Post, Body, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService) {}
    //Obtener a todos los usuarios
    @Get()
    async GetAllUsers() {
        return this.userService.getAllUsers();
    }
    //Crear a los usuarios con nombre, email, contraseña y rol
    @Post()
    async createusers(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('role') role: string
    ) {
        if (!name || !email || !password || !role) {
            throw new Error('Los campos "name" "email", "password" y "role" son obligatorios');
        }
        return this.userService.createuser(name,email, password, role);
    }
    //Login
    @Post('login')
    async validateUser(
        @Body('email') email: string,
        @Body('password') password: string
    ){
        if (!email || !password ) {
            throw new Error('Los campos "email" y "password"" son obligatorios');
        }

        return this.userService.validateUser(email, password);
    }
    //Borrar usuario
    @Delete('delete')
    async deleteUser(
        @Body('email') email: string
    ){
        if (!email) {
            throw new Error('El campo "email" es obligatorio');
        }
        return this.userService.deleteUser(email);
    }

    //Actualizar usuario
    @Put('update')
    async updateUser(
        @Body('email') email: string,
        @Body('name') name?: string,
        @Body('newEmail') newEmail?: string,
        @Body('password') password?: string,
        @Body('role') role?: string
    ) {
        if (!email) {
            throw new Error('El campo "email" es obligatorio');
        }

        const updates = { name, newEmail, password, role };
        return this.userService.updateUser(email, updates);
    }

}
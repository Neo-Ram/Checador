import { Controller, Post, Body } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { Horario } from './horarios.interface';

@Controller('horarios')
export class HorariosController {

  constructor(private readonly horariosService: HorariosService) {}

  @Post('crearhorarios')
  async createHorario(
    @Body() horario: Horario
  ) {
    return this.horariosService.createHorario(horario);
  }
}
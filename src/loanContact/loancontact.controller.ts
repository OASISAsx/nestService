import { Controller, Get, Param, Query } from '@nestjs/common';
import { LoanContactService } from './loancontact.service';

@Controller('loanContact')
export class LoanContactController {
  constructor(private readonly loanContactService: LoanContactService) {}

  @Get()
  async GetloanContact(@Query() query: Record<string, unknown>) {
    return await this.loanContactService.getLoanContacts(query);
  }

  @Get(':id')
  async GetOne(@Param('id') id: string) {
    return await this.loanContactService.getOne(id);
  }
  @Get('status/:id')
  async getLoanStatus(@Param('id') id: string) {
    return await this.loanContactService.getMainStatus(id);
  } // 👈 เพิ่มฟังก์ชันนี้
}

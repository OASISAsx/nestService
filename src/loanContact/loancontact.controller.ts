import { Controller, Get, Param, ValidationPipe } from '@nestjs/common';
import { LoanContactService } from './loancontact.service';
import { PaginationDto } from 'src/common/helpers/PaginationDto';
import { SecureQuery } from 'src/modules/guards/secure-query.decorator';

@Controller('loanContact')
export class LoanContactController {
  constructor(private readonly loanContactService: LoanContactService) {}

  @Get()
  async GetloanContact(
    @SecureQuery<PaginationDto>(new ValidationPipe({ transform: true }))
    query: PaginationDto,
  ) {
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

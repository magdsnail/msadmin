import { Controller, Get, Post, Put, Body, Request, Query, Param, Delete, InternalServerErrorException, UsePipes, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery, ApiOkResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserInfoIE } from '../common/interface';
import { CurrentUser } from '../decorator/current.user.decorator';
import { ValidationPipe } from '../pipe/validation.pipe';
import { DepartmentService } from './department.service'
import { CreateDepartment } from './dto/create.department.dto';
import { QueryDepartment } from './dto/query.department.dto';
import { UpdateDepartment } from './dto/update.department.dto';
import { DepartmentInfoResponse } from './vo/department-info.vo';
import { DepartmentListResponse } from './vo/department-list.vo';
// @UseGuards(AuthGuard('jwt'))
@ApiTags('部门管理')
@ApiBearerAuth()
@Controller('department')
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) { }

    @Get('list')
    @ApiOkResponse({ description: '部门列表', type: DepartmentListResponse })
    @ApiOperation({ summary: '部门列表' })
    async findAll(@Query() query: QueryDepartment, @CurrentUser() user: UserInfoIE) {
        return  this.departmentService.findAll({
            ...query,
            page: Number(query.page || 1),
            limit: Number(query.limit || 20)
        }, user);
    }
    
    @ApiOperation({ summary: '创建部门' })
    @UsePipes(new ValidationPipe())//使用管道验证
    @Post('save')
    @ApiBody({ type: CreateDepartment })
    @ApiOkResponse({ type: DepartmentInfoResponse })
    async add(@Body() data: CreateDepartment, @Request() req: any) {
        return await this.departmentService.create(data, req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: '获取部门详情' })
    @ApiOkResponse({ type: DepartmentInfoResponse })
    async detail(@Param('id') id: string) {
        return await this.departmentService.getInfoById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: '更新部门' })
    async modify(@Param('id') id: string, @Body() data: UpdateDepartment) {
        return await this.departmentService.modify(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除部门' })
    async remove(@Param('id') id: string) {
        return await this.departmentService.removeById(id);
    }


}

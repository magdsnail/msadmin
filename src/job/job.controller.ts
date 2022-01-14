import { Body, Param, Controller, Delete, Get, Post, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorator/roles.decorator';
import { UserInfoIE } from '../common/interface';
import { CurrentUser } from '../decorator/current.user.decorator';
import { CreateJob } from './dto/create.job.dto';
import { QueryJob } from './dto/query.job.dto';
import { UpdateJob } from './dto/update.job.dto';
import { JobService } from './job.service';

@ApiTags('岗位管理')
@ApiBearerAuth()
@Controller('job')
export class JobController {
    constructor(
        private readonly jobService: JobService
    ){}

    @Get('list')
    @ApiOperation({ summary: '岗位列表' })
    async findAll(@Query() query: QueryJob, @CurrentUser() user: UserInfoIE) {
        return  this.jobService.findAll({
            ...query,
            page: Number(query.page || 1),
            limit: Number(query.limit || 20)
        }, user);
    }

    @ApiOperation({ summary: '创建岗位' })
    @Post('save')
    @ApiBody({ type: CreateJob })
    async add(@Body() data: CreateJob, @CurrentUser() user: UserInfoIE) {
        return await this.jobService.create(data, user);
    }

    @Get(':id')
    @Roles('job:detail')
    @ApiOperation({ summary: '获取岗位详情' })
    async detail(@Param('id') id: string) {
        return await this.jobService.getInfoById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: '更新岗位' })
    async modify(@Param('id') id: string, @Body() data: UpdateJob) {
        return await this.jobService.modify(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: '删除岗位' })
    async remove(@Param('id') id: string) {
        return await this.jobService.removeById(id);
    }
}

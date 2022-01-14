import { Controller, InternalServerErrorException, Get, Post, Body, Param, Put, Delete, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRole } from './dto/create.role.dto';
import { UpdateRole, UpdateRoleMenu } from './dto/update.role.dto';
import { RoleListResponse } from './vo/role-list.vo';
import { RoleQuery } from './dto/query.role.dto';
import { CurrentUser } from '../decorator/current.user.decorator';
import { UserInfoIE } from '../common/interface';

@ApiTags('角色管理')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Get('list')
    @ApiOperation({summary: '角色列表'})
    @ApiOkResponse({ type: RoleListResponse })
    async list(@Query() query: RoleQuery, @CurrentUser() user: UserInfoIE) {
        return await this.roleService.findAll({
            ...query,
            page: Number(query.page || 1),
            limit: Number(query.limit || 20)
        }, user);
    }

    @Post('save')
    @ApiOperation({summary: '创建角色'})
    async add(@Body() data: CreateRole, @CurrentUser() user: UserInfoIE) {
        return await this.roleService.create(data, user);
    }

    @Get(':id')
    @ApiOperation({summary: '获取角色详情'})
    async detail(@Param('id') id: string) {
        return await this.roleService.findRoleById(id);
    }

    @Put(':id')
    @ApiOperation({summary: '更新角色'})
    async updateInst(@Param('id') id: string, @Body() data: UpdateRole, @CurrentUser() user: UserInfoIE) {
        return await this.roleService.updateInst(id, data, user);
    }

    @Put('menu/:id')
    @ApiOperation({summary: '更新角色菜单'})
    async updateRoleMenu(@Param('id') id: string, @Body() data: UpdateRoleMenu, @CurrentUser() user: UserInfoIE) {
        return await this.roleService.updateRoleMenu(id, data, user);
    }

    @Delete(':id')
    @ApiOperation({summary: '删除角色'})
    async remove(@Param('id') id: string) {
        return await this.roleService.removeById(id);
    }

}

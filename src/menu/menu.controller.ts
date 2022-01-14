import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../decorator/roles.decorator';
import { CreateMenu } from './dto/create.menu.dto';
import { MenuService } from './menu.service';

@ApiTags('菜单管理')
@ApiBearerAuth()
@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    @Get('list')
    @Roles('admin')
    @ApiOperation({ summary: '菜单列表' })
    async list(@Request() req: any) {
        return await this.menuService.findAll({});
    }

    @Post('save')
    @ApiBody({ type: CreateMenu })
    @ApiOperation({ summary: '菜单保存' })
    async save(@Body() data: CreateMenu, @Request() req: any) {
        return await this.menuService.save(data, req.user);
    }
}

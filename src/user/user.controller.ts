import { Controller, Get, Post, Put, Body, Query, Param, Delete, InternalServerErrorException, UseGuards, Inject, forwardRef, SetMetadata } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CreateUser } from './dto/register.user.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { LoginDTO } from './dto/user.dto'
import { AuthGuard } from '@nestjs/passport';
import { UserInfoResponse } from './vo/user-info.vo';
import { TokenResponse } from './vo/token.vo';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { SkipAuth } from '../decorator/skip-auth.decorator';
import { UserInfoIE } from '../common/interface';
import { CurrentUser } from '../decorator/current.user.decorator';
import { QueryUser } from './dto/query.user.dto';

@ApiTags('用户管理')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    // @UseGuards(AuthGuard('jwt'))
    // @UseGuards(JwtAuthGuard)
    @Post('register')
    @ApiBearerAuth()
    @ApiBody({ type: CreateUser })
    @ApiOkResponse({ type: UserInfoResponse })
    @ApiOperation({ summary: '新增用户' })
    async register(@Body() data: CreateUser, @CurrentUser() user: UserInfoIE) {
        return await this.userService.register(data, user);
    }

    @SkipAuth()
    @Post('login')
    @ApiBody({ description: '用户登录', type: LoginDTO })
    @ApiOkResponse({ type: TokenResponse, description: '登录' })
    @ApiOperation({ summary: '用户登录' })
    async login(@Body() loginParmas: LoginDTO) {
        // console.log('JWT验证 - Step 1: 用户请求登录');
        const user = await this.authService.validateUser(loginParmas.username, loginParmas.password);
        return await this.authService.certificate(user);
    }

    @Get('auth/me')
    @ApiBearerAuth()
    @ApiOperation({ summary: '获取登录用户信息' })
    async authMe(@CurrentUser() user: UserInfoIE) {
        return await this.userService.getAuthMe(user);
    }

    @Get('list')
    @ApiBearerAuth()
    @ApiOperation({ summary: '用户列表' })
    async findAll(@Query() query: QueryUser, @CurrentUser() user: UserInfoIE) {
        return this.userService.findAll({ 
            ...query,
            page: Number(query.page || 1),
            limit: Number(query.limit || 20),
            user 
        });
    }


}

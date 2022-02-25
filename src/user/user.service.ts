import { Injectable, HttpException, NotFoundException, ConflictException, NotAcceptableException } from '@nestjs/common';
import { AppCode } from '../common/code.enum';
import { User, UserDocument } from '../schemas/sys/user';
import { CreateUser } from './dto/register.user.dto';
import { makeSalt, encryptPassword } from '../utils/cryptogram';
import { LoginDTO } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { ConditonData, UserInfoIE } from '../common/interface';
import { JobService } from '../job/job.service';
import { RoleService } from '../role/role.service';
import { DepartmentService } from '../department/department.service';
import { DataPermission } from '../common/data.permission.enum';
import { MenuService } from '../menu/menu.service';
import { Menu } from '../schemas/sys/menu';
import * as svgCaptcha from 'svg-captcha';
import helper from '../utils/helper'
import { CAPTCHA_IMG_KEY, USER_TOKEN_KEY, USER_VERSION_KEY } from '../contants/redis.contant';
import { RedisService } from '../dynamic/redis/redis.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly user: PaginateModel<UserDocument>,
        private redisService: RedisService,
        private readonly jobService: JobService,
        private readonly roleService: RoleService,
        private readonly departmentService: DepartmentService,
        private readonly menuService: MenuService,
        private readonly configService: ConfigService
    ) { }

    /* 创建验证码图片 */
    async createImageCaptcha() {
        const svg = svgCaptcha.create({
            size: 4,
            color: true,
            noise: 4,
            width: 150,
            height: 50,
            charPreset: '1234567890'
        });
        const result = {
            img: `data:image/svg+xml;base64,${Buffer.from(svg.data).toString(
                'base64',
            )}`,
            uuid: helper.generateUUID(),
        };
        await this.redisService.getRedis('admin').set(`${CAPTCHA_IMG_KEY}:${result.uuid}`, svg.text, 'EX', 60 * 5);
        return {
            info: result
        };
    }

    async login(request: Request, jwttoken: string) {
        const { user } = request as any;
        let token = jwttoken;
        const expires = this.configService.get<number>('JWT.redisExpires');
        //开发环境 复用 token，取消单点登录
        if (process.env.NODE_ENV == 'development') {
            const tagtoken = await this.redisService.getRedis('admin').get(`${USER_TOKEN_KEY}:${user.id}`)
            if (tagtoken) {
                token = tagtoken
            }
        }
        //存储密码版本号，防止登录期间 密码被管理员更改后 还能继续登录
        await this.redisService.getRedis('admin').set(`${USER_VERSION_KEY}:${user.id}`, 1)
        //存储token, 防止重复登录问题，设置token过期时间(1天后 token 自动过期)，以及主动注销token。
        await this.redisService.getRedis('admin').set(`${USER_TOKEN_KEY}:${user.id}`, token, 'EX', expires);
        return {
            info: {
                token
            }
        }

    }

    /**
     * 查询是否有该用户
     * @param username 用户名
     */
    async findOne(username: string): Promise<any> {
        const user = await this.user.findOne({ username });
        return user;
    }

    /**
     * 用户列表
     * @param item 
     * @returns 
     */
    async findAll(item: ConditonData) {
        const { page, limit, user } = item;
        const { docs, totalDocs, totalPages } = await this.user.paginate({}, {
            page, limit
        });
        const departmentObj = (await this.departmentService.findByIds([...new Set(docs.map(m => m.department_id))])).reduce((pre, cur) => {
            pre[cur.id] = cur;
            return pre;
        }, {});
        const list = [];
        for (let v of docs) {
            list.push({
                id: v.id,
                username: v.username,
                nickname: v.nickname,
                enabled: v.enabled,
                isadmin: v.is_admin,
                departmentId: departmentObj?.[v.department_id] ?? {},
                jobs: await this.jobService.findByIds(v.job_ids),
                roles: await this.roleService.findByIds(v.role_ids),
                createdBy: v.create_by ?? '',
                updateBy: v.update_by ?? ''
            });
        }
        return {
            list,
            pagination: {
                page, limit, total: totalDocs, pages: totalPages
            }
        }
    }

    /**
     * 注册验证
     */
    async checkRegisterData(data: CreateUser) {
        const { username, password, repassword } = data;
        if (password !== repassword) {
            throw new NotFoundException('两次输入的密码不一致，请检查')
        }
        const hasUser = await this.user.findOne({ username })
        if (hasUser) {
            throw new ConflictException('用户已存在')
        }
    }

    /**
     * 注册用户
     * @param data 
     */
    async register(data: CreateUser, user: UserInfoIE) {
        const { departmentId, jobIds, roleIds, username, password, nickname, phone, email, avatar, isadmin } = data;
        await this.checkRegisterData(data);
        const salt = makeSalt();//制作密码盐
        const hashPwd = encryptPassword(password, salt); //加密密码
        const item = {
            salt,
            phone,
            email,
            avatar,
            department_id: departmentId,
            job_ids: jobIds,
            role_ids: roleIds,
            username: username,
            nickname: nickname,
            password: hashPwd,
            is_admin: isadmin,
            enabled: true
        };
        const res = await this.user.create(item);
        if (!res) {
            throw new NotAcceptableException('注册失败');
        }
        return {
            info: res
        }
    }

    async getAuthMe(user: UserInfoIE) {
        const { user_id } = user;
        const menuIds = new Set([]);
        let menus = [];
        const userInfo = await this.user.findById(user_id);
        if (userInfo.is_admin) {
            const { list } = await this.menuService.findAll({})
            menus = list;
        } else {
            const roles = await this.roleService.findByIds(userInfo.role_ids);
            for (const role of roles) {
                role.menu_ids.forEach((f: string) => {
                    menuIds.add(f);
                });
            }
            menus = await this.menuService.findByIds([...menuIds]);
        }
        return {
            info: {
                menus,
                username: userInfo.username
            }
        }
    }

    /**
     * 查找权限
     * @param roleIds
     */
    async findUserPerms(user: UserInfoIE) {
        const departmentIds = new Set([]);
        const permissions = new Set([]);
        const menuIds = new Set([]);
        const userInfo = await this.user.findById(user.user_id);
        const retdata = {
            is_admin: userInfo.is_admin,
            department_id: userInfo.department_id,
            permissions: [...permissions],
            departmentIds: [...departmentIds]
        };
        if (userInfo?.is_admin) {
            return retdata;
        }
        const roles = await this.roleService.findByIds(userInfo.role_ids);
        for (const role of roles) {
            role.menu_ids.forEach((f: string) => {
                menuIds.add(f);
            });
            if (role.dataScope === DataPermission.Self) {
                departmentIds.add(userInfo.department_id);
            } else if (role.dataScope === DataPermission.Custome) {
                role.department_ids.forEach((e: string) => {
                    departmentIds.add(e);
                });
            }
        }
        if (menuIds.size) {
            const menus = await this.menuService.findByIds([...menuIds]);
            menus.forEach((f) => {
                permissions.add(f.permission);
            })
        }
        return {
            ...retdata,
            permissions: [...permissions],
            departmentIds: [...departmentIds]
        }

    }


}

import { Injectable, HttpException, InternalServerErrorException } from '@nestjs/common';
import { CreateRole } from './dto/create.role.dto';
import { UpdateRole, UpdateRoleMenu } from './dto/update.role.dto';
import { Role, RoleDocument } from '../schemas/sys/role';
import { AppCode } from '../common/code.enum';
import { Model, PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConditonData, UserInfoIE } from '../common/interface';
import { RoleDepartment } from '../schemas/sys/role_dept';
import { RoleMenu, RoleMenuDocument } from '../schemas/sys/role_menu';
import { MenuService } from '../menu/menu.service';
import { DepartmentService } from '../department/department.service';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name)
        private readonly role: PaginateModel<RoleDocument>,
        private readonly menuService: MenuService,
        private readonly departmentService: DepartmentService
    ) {
    }

    async findAll(data: ConditonData, user: UserInfoIE) {
        const { page, limit } = data;
        const { docs, totalDocs, totalPages } = await this.role.paginate({
        }, {
            page, limit
        });
        const list = [];
        for(let role of docs) {
            list.push({
                departments: await this.departmentService.findByIds(role.department_ids),
                menus: await this.menuService.findByIds(role.menu_ids),
                id: role.id,
                title: role.title, 
                description: role.description,
                dataScope: role.data_scope,
                createBy: role.create_by
            })
        }
        return {
            list,
            pagination: {
                page, limit, total: totalDocs, pages: totalPages
            }
        };
    }

    async findByIds(ids: string[] | []) {
        const roles = await this.role.find({
            _id: { $in: ids }
        });
        const list = [];
        for (let v of roles) {
            list.push({
                id: v .id,
                title: v .title, 
                description: v .description,
                dataScope: v .data_scope
            });
        }
        return list;
    }

    async create(data: CreateRole, user: UserInfoIE) {
        const item = {
            title: data.title,
            level: data.level,
            description: data.description,
            data_scope: data.dataScope,
            department_ids: data.departmentIds,
            create_by: user.username
        };
        const res = await this.role.create(item);
        if (!res) {
            throw new HttpException('添加失败', AppCode.SystemError)
        }
        return {
            info: {
                id: res.id,
                title: res.title,
                level: res.level,
                dataScope: res.data_scope
            }
        }
    }

    async findRoleById(id: string): Promise<any> {
        const role = await this.role.findById(id);
        if (!role) throw new HttpException(`查询失败， ID 为 ${id} 的角色不存在或已删除`, 404);
        const menuIds = role.menu_ids;
        // const menuObj = (await this.menuService.findByIds(menuIds)).reduce((pre, cur) => {
        //     pre[cur.id] = cur;
        //     return pre;
        // }, {});
        const departments = await this.departmentService.findByIds(role.department_ids);
        const menus = await this.menuService.findByIds(role.menu_ids);
        return {
            info: {
                menus,
                departments,
                id: role.id,
                title: role.title, 
                description: role.description,
                dataScope: role.data_scope,
                createBy: role.create_by
            }
        }
    }

    /**
     * 更新整个
     * @param item 
     * @param user 
     * @returns 
     */
    async updateInst(id: string, item: UpdateRole, user: UserInfoIE): Promise<any> {
        const roleInfo = await this.role.findOneAndUpdate({ _id: id }, {
            title: item.title,
            level: item.level,
            description: item.description,
            data_scope: item.dataScope,
            update_by: user.username
        }, { new: true });
        if (roleInfo) {
            return {
                info: {
                    id: roleInfo.id,
                    title: roleInfo.title,
                    level: roleInfo.level,
                    description: roleInfo.description,
                    dataScope: roleInfo.data_scope
                }
            }
        } else {
            throw new HttpException(`更新失败，ID 为 ${id} 的角色不存在或已经删除`, 404)
        }
    }

    /**
    * 更新role-menu
    * @param item 
    * @param user 
    * @returns 
    */
    async updateRoleMenu(id: string, item: UpdateRoleMenu, user: UserInfoIE): Promise<any> {
        const { menuIds = [] } = item;
        const updateData = {
            menu_ids: menuIds,
            update_by: user.username
        };
        if(!menuIds.length) {
            updateData.menu_ids = [];
        }
        try {
            const msg = await this.role.findByIdAndUpdate(id, {
                $set: updateData
            });
            if(msg) {
                return {};
            } else {
                throw new InternalServerErrorException('更新失败');
            }
        } catch (error) {
            throw new InternalServerErrorException('更新失败');
        }
    }

    async removeById(id: string) {
        const res = this.role.findByIdAndDelete(id);
        return {}
    }

}

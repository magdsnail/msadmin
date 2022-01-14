import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { Menu, MenuDocument } from '../schemas/sys/menu';
import { ConditonData, UserInfoIE } from '../common/interface';
import { CreateMenu } from './dto/create.menu.dto';

@Injectable()
export class MenuService {
    constructor(
        @InjectModel(Menu.name)
        private readonly menu: PaginateModel<MenuDocument>
    ) { }

    async findAll(data: ConditonData) {
        const menus = await this.menu.find();
        return {
            list: menus.flatMap(f => [{
                id: f.id,
                title: f.title,
                parentId: f.parent_id,
                type: f.type,
                sort: f.sort,
                icon: f.icon,
                permission: f.permission,
                createBy: f.create_by,
                name: f.name,
                component: f.component
            }])
        }
    }

    async findByIds(ids: Array<string>) {
        const menus = await this.menu.find({
            _id: { $in: ids }
        });
        return menus.flatMap(f => [{
            id: f.id,
            title: f.title,
            parentId: f.parent_id,
            type: f.type,
            sort: f.sort,
            icon: f.icon,
            permission: f.permission,
            createBy: f.create_by,
            name: f.name,
            component: f.component
        }])
    }

    async save(data: CreateMenu, user: UserInfoIE) {
        const inst = {
            ...data,
            parent_id: data.parentId
        };
        const result = await this.menu.create(inst);
        if(!result) {
            throw new InternalServerErrorException('添加失败');
        }
        return {
            info: {
                id: result.id,
                parentId: result.parent_id,
                title: result.title,
                sort: result.sort,
                permission: result.permission,
                name: result.name,
                component: result.component
            }
        };
    }

}

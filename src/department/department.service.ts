import { Injectable, HttpException, HttpCode, HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateDepartment } from './dto/create.department.dto'
import { UpdateDepartment } from './dto/update.department.dto';
import { Department, DepartmentDocument } from '../schemas/sys/department';
import { AppCode } from '../common/code.enum';
import { Model, PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConditonData, UserInfoIE } from '../common/interface';
@Injectable()
export class DepartmentService {
    constructor(
        @InjectModel(Department.name)
        private readonly department: PaginateModel<DepartmentDocument>
    ) { }

    async findAll(data: ConditonData, user: UserInfoIE) {
        const { page, limit, pid = '' } = data;
        if(pid) {
            return await this.findAllByParentId(pid, user);
        }
        const { docs, totalDocs, totalPages } = await this.department.paginate({
            parent_id: ''
        },{
            page, limit
        });
        const list = [];
        for (let v of docs) {
            list.push({
                id: v.id,
                parentId: v.parent_id,
                title: v.title,
                sort: v.sort,
                enabled: v.enabled
            });
        }
        return {
            list,
            pagination: {
                page, limit, total: totalDocs, pages: totalPages
            }
        }
    }

    async findAllByParentId(pid: string, user: UserInfoIE) {
        const departments = await this.department.find({
            parent_id: pid
        });
        return {
            list: departments.flatMap(f => [{
                id: f.id,
                parentId: f.parent_id,
                title: f.title,
                sort: f.sort,
                enabled: f.enabled
            }])
        }
    }


    async findByIds(ids: string[] | []) {
        const departments = await this.department.find({
            _id: { $in: ids }
        });
        const list = [];
        for (let v of departments) {
            list.push({
                id: v.id,
                parentId: v.parent_id,
                title: v.title,
                sort: v.sort,
                enabled: v.enabled
            });
        }
        return list;
    }

    async create(data: CreateDepartment, user: UserInfoIE) {
        const item = {
            parent_id: data.parentId,
            sort: data.sort,
            title: data.title,
            enabled: data.enabled,
            create_by: user.username
        };
        const res = await this.department.create(item);
        if (!res) {
            throw new InternalServerErrorException('添加失败')
        }
        return {
            info: {
                id: res.id,
                parentId: res.parent_id,
                title: res.title,
                sort: res.sort,
                enabled: res.enabled
            }
        }
    }

    async getInfoById(id: string) {
        const info = await this.department.findById(id);
        if (!info) {
            // throw new HttpException('信息不存在', HttpStatus.NOT_FOUND)
            throw new NotFoundException('信息不存在');
        }
        return {
            info: {
                id: info.id,
                title: info.title,
                parentId: info.parent_id,
                enabled: info.enabled,
                sort: info.sort
            }
        }
    }

    async modify(id: string, item: UpdateDepartment): Promise<any> {
        const info = await this.department.findOne({ _id: id });
        if (info) {
            const res = await this.department.findOneAndUpdate({ _id: id }, item)
            return {
                info: {
                    id: res.id,
                    title: res.title,
                    sort: res.sort,
                    enabled: res.enabled
                }
            };
        } else {
            throw new NotFoundException(`更新失败，ID 为 ${id} 的部门不存在或已经删除`);
        }
    }

    async removeById(id: string) {
        const res = await this.department.deleteOne({
            _id: id
        });
        return {}
    }



}

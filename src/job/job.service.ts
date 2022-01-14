import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { modelNames, PaginateModel } from 'mongoose';
import { AppCode } from '../common/code.enum';
import { Logger } from '../utils/log4js';
import { Job, JobDocument } from '../schemas/sys/job';
import { CreateJob } from './dto/create.job.dto';
import { UpdateJob } from './dto/update.job.dto';
import { ConditonData, UserInfoIE } from '../common/interface';

@Injectable()
export class JobService {
    constructor(
        @InjectModel(Job.name)
        private readonly job: PaginateModel<JobDocument>
    ) { }

    async findAll(data: ConditonData, user: UserInfoIE) {
        const { page, limit } = data;
        const { docs, totalDocs, totalPages } = await this.job.paginate({
        }, {
            page, 
            limit
        });
        const list = [];
        for (let v of docs) {
            list.push({
                id: v.id,
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
        };
    }

    async findByIds(ids: string[] | []) {
        const roles = await this.job.find({
            _id: { $in: ids }
        });
        const list = [];
        for (let v of roles) {
            list.push({
                id: v.id,
                title: v.title,
                sort: v.sort,
                enabled: v.enabled
            });
        }
        return list;
    }

    async create(data: CreateJob, user: UserInfoIE) {
        const item = {
            sort: data.sort,
            title: data.title,
            enabled: data.enabled,
            create_by: '',
            update_by: ''
        };
        const res = await this.job.create(item);
        if (!res) {
            throw new HttpException('添加失败', AppCode.SystemError)
        }
        return {
            info: {
                id: res.id,
                title: res.title,
                sort: res.sort,
                enabled: res.enabled
            }
        }
    }

    async getInfoById(id: string) {
        const info = await this.job.findById(id);
        if (!info) {
            throw new NotFoundException('信息不存在');
        }
        return {
            info: {
                title: info.title,
                enabled: info.enabled,
                sort: info.sort
            }
        }
    }

    async modify(id: string, item: UpdateJob): Promise<any> {
        const res = await this.job.findOneAndUpdate({ _id: id }, item, { new: true });
        if (res) {
            return {
                info: {
                    id: res.id,
                    title: res.title,
                    sort: res.sort,
                    enabled: res.enabled
                }
            }
        } else {
            throw new NotFoundException(`更新失败，ID 为 ${id} 的岗位不存在或已经删除`);
        }
    }

    /**
     * 根据id删除岗位
     * @param id 
     * @returns 
     */
    async removeById(id: string) {
        const res = await this.job.findByIdAndDelete(id);
        return {}
    }


}

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

/**
 * 角色表
 */

export type RoleDocument = Role & Document;
@Schema({
    collection: 'sys_role',
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    versionKey: false
})
export class Role {
    @Prop({ required: true })
    title: string;

    @Prop()
    level: number;//角色级别

    @Prop({ default: '' })
    description: string;//描述

    @Prop({ required: true })
    data_scope: number;//数据权限 0 全部 1本级 2自定义

    @Prop({ type: Array, default: [] })
    department_ids: [string];//数据权限定义

    @Prop({ type: Array, default: [] })
    menu_ids: [string];//功能权限定义

    @Prop({ default: '' })
    create_by: string;

    @Prop({ default: '' })
    update_by: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
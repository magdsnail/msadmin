import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
/**
 * 角色部门表 暂未使用
 */
export type RoleDepartmentDocument = RoleDepartment & Document;

@Schema({
    collection: 'sys_role_department',
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    versionKey: false
})
export class RoleDepartment {
    @Prop({ required: true, index: true })
    role_id: string;

    @Prop({ required: true, index: true })
    dept_id: string;
}

export const RoleDepartmentSchema = SchemaFactory.createForClass(RoleDepartment);
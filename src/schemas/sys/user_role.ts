import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

/**
 * 用户角色表 暂不使用
 */
export type RoleMenuDocument = RoleMenu & Document;
@Schema({
    collection: 'sys_user_role',
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    versionKey: false
})
export class RoleMenu {
    @Prop({ required: true, index: true })
    role_id: string;

    @Prop({ required: true, index: true })
    user_id: string;
}

export const RoleMenuSchema = SchemaFactory.createForClass(RoleMenu);
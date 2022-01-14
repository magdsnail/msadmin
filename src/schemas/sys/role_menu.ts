import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
/**
 * 角色菜单权限表 暂未使用
 */
export type RoleMenuDocument = RoleMenu & Document;

@Schema({
    collection: 'sys_role_menu',
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
    menu_id: string;
}

export const RoleMenuSchema = SchemaFactory.createForClass(RoleMenu);
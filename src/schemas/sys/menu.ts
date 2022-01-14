import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
/**
 * 菜单权限表
 */

export type MenuDocument = Menu & Document;

@Schema({
    collection: 'sys_menu',
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    versionKey: false
})
export class Menu {
    @Prop({ default: '' })
    parent_id: string;

    @Prop({ required: true, default: 0 })
    type: number;//菜单类型 0顶级 1菜单 2按钮

    @Prop({ required: true })
    title: string;//菜单标题

    @Prop()
    name: string;//组件标题

    @Prop()
    component: string;//组件

    @Prop()
    sort: number;

    @Prop({ default: '' })
    icon: string; //图标

    @Prop({ default: false })
    iframe: boolean; //是否外链

    @Prop({ default: false })
    cache: boolean; //缓存

    @Prop({ default: false })
    hidden: boolean; //隐藏

    @Prop({ default: '' })
    permission: string; //权限

    @Prop({ default: '' })
    create_by: string;

    @Prop({ default: '' })
    update_by: string;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);
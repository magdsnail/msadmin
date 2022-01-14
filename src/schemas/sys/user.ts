import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, plugin } from 'mongoose';

/**
 * 用户表
 */
export type UserDocument = User & Document;
@Schema({
    collection: 'sys_user',
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    versionKey: false
})
export class User {
    @Prop({ required: true, index: true })
    department_id: string;

    @Prop({ type: [], defalult: [], required: true, index: true })
    job_ids: string[];

    @Prop({ type: [], defalult: [], required: true, index: true })
    role_ids: string[];

    @Prop({ required: true, index: true, trim: true })
    username: string;

    @Prop({ required: true, trim: true })
    nickname: string; //昵称

    @Prop({ required: true })
    salt: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ default: '' })
    email: string;

    @Prop({ default: '' })
    avatar: string;

    @Prop({ default: false })
    is_admin: boolean;

    @Prop({ default: true })
    enabled: boolean;

    @Prop({ default: '' })
    pwd_reset_time?: Date;//修改密码时间

    @Prop()
    create_by?: string;

    @Prop({ default: '' })
    update_by?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
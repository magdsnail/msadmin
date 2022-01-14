import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;
@Schema({
    collection: 'sys_department',
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    versionKey: false
})
export class Department {
    @Prop({ default: '', index: true })
    parent_id: string;

    @Prop({ required: true })
    title: string;

    @Prop({ index: true })
    sort: number;

    @Prop({ default: true })
    enabled: boolean;

    @Prop({default: ''})
    create_by: string;

    @Prop({default: ''})
    update_by: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * 岗位表
 */

export type JobDocument = Job & Document;

@Schema({
    collection: 'sys_job',
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    },
    versionKey: false
})
export class Job {
    @Prop({ required: true })
    title: string;

    @Prop({ index: true })
    sort: number;

    @Prop({ default: true })
    enabled?: boolean;

    @Prop({ default: '' })
    create_by: string;

    @Prop({ default: '' })
    update_by: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
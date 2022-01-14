import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

/**
 * 更新岗位
 */
export class UpdateJob {
    @ApiProperty({description: '岗位名称', required: true})
    @IsNotEmpty({ message: '请填写岗位名称'})
    title: string;

    @ApiProperty({description: '排序', required: true})
    @IsNotEmpty({ message: '请填写排序信息' })
    sort: number;

    @ApiProperty({ description: '排序' })
    enabled: boolean;
}
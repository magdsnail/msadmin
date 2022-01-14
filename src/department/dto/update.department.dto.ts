import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

/**
 * 更新部门
 */
export class UpdateDepartment {
    @ApiProperty({description: '父级部门id, 顶级部门（没有）默认为空' })
    @ApiPropertyOptional()
    @IsString()
    parentId: string;

    @ApiProperty({description: '部门名称', required: true})
    @IsNotEmpty({ message: '请填写部门名称'})
    title: string;

    @ApiProperty({description: '排序', required: true})
    @IsNotEmpty({ message: '请填写排序信息' })
    sort: number;

    @ApiProperty({ description: '排序' })
    enabled: boolean;
}
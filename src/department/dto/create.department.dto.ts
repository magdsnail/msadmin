import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * 创建部门
 */
export class CreateDepartment{ 
    @ApiProperty({description: '父级部门id, 顶级部门（没有）默认为空' })
    @ApiPropertyOptional({
        description: '父级部门id',
        default: ''
    })
    parentId?: string;

    @ApiProperty({ description: '部门名称' })
    @IsString({ message: '部门名称必须是 String 类型' })
    @IsNotEmpty({ message: '请填写部门名称'})
    title: string;

    @ApiProperty({ description: '排序' })
    @IsNotEmpty({ message: '请填写排序信息' })
    sort: number;

    @ApiProperty({ description: '状态' })
    enabled: boolean;
}
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateMenu { 
    @ApiProperty({description: '父级id, 顶级（没有）默认为空' })
    @ApiPropertyOptional({
        description: '父级id',
        default: ''
    })
    parentId?: string;

    @ApiProperty({ description: '名称' })
    @IsString({ message: '名称必须是 String 类型' })
    @IsNotEmpty({ message: '请填写名称'})
    title: string;

    @ApiProperty({ description: '组件名称' })
    @ApiPropertyOptional()
    name: string;

    @ApiProperty({ description: '名称' })
    @ApiPropertyOptional()
    component?: string;

    @ApiProperty({ description: '排序' })
    @ApiPropertyOptional()
    sort?: number;

    @ApiProperty({ description: '类型', example: 0 })
    @ApiPropertyOptional()
    type?: number;

    @ApiProperty({ description: '图标', example: '小鱼儿' })
    @ApiPropertyOptional()
    icon?: string;

    @ApiProperty({ description: '是否外链', example: false })
    @ApiPropertyOptional()
    iframe?: boolean;

    @ApiProperty({ description: '是否缓存', example: false })
    @ApiPropertyOptional()
    cache?: boolean;

    @ApiProperty({ description: '是否缓存', example: 'user:list' })
    @ApiPropertyOptional()
    permission?: string;

    @ApiProperty({ description: '是否隐藏', example: false })
    @ApiPropertyOptional()
    hidden?: boolean;
}
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateRole {
    @ApiProperty({ description: '角色名称' })
    @IsString({ message: '不是有效数据' })
    @IsNotEmpty({ message: '角色名称不能为空' })
    title: string;
  
    @ApiProperty({ description: '角色级别' })
    @IsNotEmpty({ message: '请填写项目关联信息' })
    level: number;
  
    @ApiProperty({ description: '描述', required: false })
    description: string;
  
    @ApiProperty({ description: '数据权限' })
    dataScope: string;

    @ApiProperty({ description: '数据权限定义', example: ['1234231'] })
    @ApiPropertyOptional()
    departmentIds?: [];
}

export class UpdateRoleMenu {
    @ApiProperty({ description: '菜单选项' })
    @IsNotEmpty({ message: '菜单不能为空' })
    menuIds: [string];
}
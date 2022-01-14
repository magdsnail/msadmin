import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsArray, Allow, Max } from 'class-validator'

export class CreateUser {
  @ApiProperty({ description: '部门id' })
  @IsNotEmpty({ message: '请填写部门关联信息' })
  departmentId: string;

  @ApiProperty({ description: '岗位id' })
  @IsNotEmpty({ message: '请填写部门关联信息' })
  jobIds: string[];

  @ApiProperty({ description: '角色id' })
  @IsNotEmpty({ message: '请填写部门关联信息' })
  roleIds: string[];

  @ApiProperty({ description: '登录名称' })
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '登录名称不能为空' })
  username: string

  @ApiProperty({ description: '昵称' })
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string;

  @ApiProperty({ description: '密码' })
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string

  @ApiProperty({ description: '密码' })
  @IsString({ message: '不是有效数据' })
  @IsNotEmpty({ message: '密码不能为空' })
  repassword: string

  @ApiProperty({ description: '手机' })
  @IsNotEmpty({ message: '手机不能为空' })
  phone: string

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string

  @ApiProperty({ description: '头像', required: false, default: '' })
  avatar: string;

  @ApiProperty({ description: '是否是管理员', default: false })
  isadmin: boolean;
}

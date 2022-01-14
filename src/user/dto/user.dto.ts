import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDTO {
    @ApiProperty()
    @IsNotEmpty({ message: '用户名不能为空' })
    username: string;

    @ApiProperty()
    @IsNotEmpty({ message: '密码不能为空' })
    password: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, isNumber, IsNumber, IsOptional, IsString, Matches } from "class-validator"
import { regPositiveOrEmpty } from "../utils/regex.util";

export class RequestDTO {
    @ApiProperty({
        description: '第几页',
        example: 1,
        required: false,
      })
      @IsOptional()
      @Matches(regPositiveOrEmpty, { message: 'page 不可小于 0' })
      readonly page?: number;
    
      @ApiProperty({
        description: '每页数据条数',
        example: 10,
        required: false,
      })
      @IsOptional()
      @Matches(regPositiveOrEmpty, { message: 'limit 不可小于 0' })
      readonly limit?: number;
}

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RequestDTO } from "../../common/request.dto";

/**
 * 查询部门列表
 */
export class QueryDepartment extends RequestDTO {
    @ApiProperty({
        description: '父级id',
        example: 1
      })
    @ApiPropertyOptional()
    readonly pid?: string;
}
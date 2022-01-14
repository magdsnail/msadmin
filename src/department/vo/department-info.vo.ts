import { ApiProperty } from "@nestjs/swagger";
import { DepartmentInfoItem } from "./department-base.vo";

export class DepartmentInfoVO {
  @ApiProperty({ type: DepartmentInfoItem })
  info: DepartmentInfoItem
}

export class DepartmentInfoResponse {
  @ApiProperty({ description: '状态码', example: 200, })
  code: number

  @ApiProperty({ description: '数据', type: () => DepartmentInfoVO, example: DepartmentInfoVO, })
  data: DepartmentInfoVO

  @ApiProperty({ description: '请求结果信息', example: '请求成功' })
  msg: string
} 
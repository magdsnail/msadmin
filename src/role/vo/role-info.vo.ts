import { ApiProperty } from "@nestjs/swagger";
import { RoleListItem } from "./role-base.vo";

export class RoleInfoVO {
  @ApiProperty({ type: RoleListItem, isArray: true })
  info: Array<RoleListItem>
}

export class RoleInfoResponse {
  @ApiProperty({ description: '状态码', example: 200, })
  code: number

  @ApiProperty({ description: '数据', type: () => RoleInfoVO, example: RoleInfoVO, })
  data: RoleInfoVO

  @ApiProperty({ description: '请求结果信息', example: '请求成功' })
  msg: string
} 
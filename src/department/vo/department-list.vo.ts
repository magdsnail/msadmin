import { ApiProperty } from "@nestjs/swagger";
import { DepartmentListItem } from "./department-base.vo";


class Pagination {
  @ApiProperty({ description: '第几页', example: 1 })
  page: number

  @ApiProperty({ description: '每页条数', example: 10 })
  limit: number

  @ApiProperty({ description: '总页数', example: 10 })
  pages: number

  @ApiProperty({ description: '总条数', example: 100 })
  total: number
}

export class DepartmentListVO {
  @ApiProperty({ type: DepartmentListItem, isArray: true })
  list: Array<DepartmentListItem>

  @ApiProperty({ type: () => Pagination })
  pagination: Pagination
}

export class DepartmentListResponse {
  @ApiProperty({ description: '状态码', example: 200, })
  code: number

  @ApiProperty({ description: '数据', type: () => DepartmentListVO, example: DepartmentListVO, })
  data: DepartmentListVO

  @ApiProperty({ description: '请求结果信息', example: '请求成功' })
  msg: string
} 
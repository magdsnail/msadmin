import { ApiProperty } from '@nestjs/swagger'

class DepartmentBase {
  @ApiProperty({ description: '部门id' })
  id: string;

  @ApiProperty({ description: '父级id' })
  parentId: string;

  @ApiProperty({ description: '部门名称' })
  title: string;

  @ApiProperty({ description: '排序' })
  sort: number;

  @ApiProperty({ description: '状态' })
  enabled: boolean;
}

export class DepartmentListItem extends DepartmentBase { }


export class DepartmentInfoItem extends DepartmentBase { }
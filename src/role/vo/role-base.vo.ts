import { ApiProperty } from '@nestjs/swagger'

class RoleBase {
  @ApiProperty({ description: '角色id' })
  id: string;

  @ApiProperty({ description: '角色名称' })
  title: string;

  @ApiProperty({ description: '数据权限' })
  dataScope: string;
}

export class RoleListItem extends RoleBase { }


export class RoleInfoItem extends RoleBase { }
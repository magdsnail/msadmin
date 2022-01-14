import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Menu, MenuSchema } from '../schemas/sys/menu';
import * as mongoosePaginate from 'mongoose-paginate-v2'

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Menu.name,
        useFactory: () => {
          const schema = MenuSchema;
          schema.plugin(mongoosePaginate);
          return schema;
        },
      },
    ])
  ],
  providers: [MenuService],
  controllers: [MenuController],
  exports: [MenuService]
})
export class MenuModule {}

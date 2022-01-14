import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from './constant';

export const Roles = (...args: string[]) => SetMetadata(ROLES_KEY, args);
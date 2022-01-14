import { SetMetadata } from '@nestjs/common';
import { IS_SKIPAUTH_KEY } from './constant';

export const SkipAuth = () => SetMetadata(IS_SKIPAUTH_KEY, true);

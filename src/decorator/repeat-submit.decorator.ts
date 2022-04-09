import { SetMetadata } from '@nestjs/common';
import { REOEATSUBMIT_METADATA } from './constant';

export class RepeatSubmitOption {
  interval?: number = 10       //默认5s
  message?: string = '请求过于频繁'
}

export const RepeatSubmit = (option?: RepeatSubmitOption) => {
  const repeatSubmitOption = Object.assign(new RepeatSubmitOption(), option)
  return SetMetadata(REOEATSUBMIT_METADATA, repeatSubmitOption)
}
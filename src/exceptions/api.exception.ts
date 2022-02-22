import { HttpException } from '@nestjs/common';
import { ErrorCodeMap } from '../contants/error-code.contants';

/**
 * Api业务异常均抛出该异常
 */
export class ApiException extends HttpException {
  /**
   * 业务类型错误代码，非Http code
   */
  private errorCode: number;

  constructor(errorCode: number) {
    super(ErrorCodeMap[errorCode], 200);
    this.errorCode = errorCode;
  }

  getErrorCode(): number {
    return this.errorCode;
  }
}

// import { HttpException } from '@nestjs/common';

// export class ApiException extends HttpException {
//   private errCode: number
//   constructor(msg: string, errCode?: number) {
//     //权限问题一律使用401错误码
//     if (errCode && errCode == 401) {
//       super(msg, 200)
//       this.errCode = 401
//     } else {
//       //其他异常一律使用500错误码
//       super(msg, errCode ?? 200)
//       this.errCode = errCode ?? 500
//     }
//   }
//   getErrCode(): number {
//     return this.errCode
//   }
// }

// 使用 throw new ApiException(1002)
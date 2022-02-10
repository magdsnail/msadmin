import { ModuleMetadata } from '@nestjs/common';

import axios, { AxiosRequestConfig } from 'axios'

export interface AxiosModuleOptions extends AxiosRequestConfig {
  name?: string;
}

export interface AxiosModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | AxiosModuleOptions
    | AxiosModuleOptions[]
    | Promise<AxiosModuleOptions>
    | Promise<AxiosModuleOptions[]>;
  inject?: any[];
}

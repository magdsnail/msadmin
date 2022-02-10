import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance, AxiosRequestConfig, Method, AxiosResponse, Axios } from 'axios'
import { ConditonData } from "../../common/interface";
import { REQUEST_CLIENT, REQUEST_DEFAULT_CLIENT_KEY } from './constants';

@Injectable()
export class RequestService {
    constructor(
        @Inject(REQUEST_CLIENT)
        private readonly instances: Map<string, Axios | AxiosInstance>
    ){}

    getRequest(name = REQUEST_DEFAULT_CLIENT_KEY) {
        if(!this.instances.has(name)) {
            throw new Error(`request client ${name} does not exist`);
        }
        return this.instances.get(name) as AxiosInstance;
    }

    _request(url: string, params: any, name: string, options: AxiosRequestConfig, method: Method): Promise<AxiosResponse> {
        return new Promise((resolve, reject) => {
            let data = {}
            if (method == 'get') {
                data = { params }
            }
            if (method == 'post') {
                data = { data: params }
            }
            const instance = this.instances.get(name) as AxiosInstance;
            instance({
                url,
                method,
                ...data,
                ...options
            }).then((res) => {
                if (res.status === 200) {
                    return resolve(res.data);
                } else {
                    return reject(res);
                }
            }).catch((error) => {
                return reject(error);
            })
        })
    }

    get(url: string, data: any, name: string = REQUEST_DEFAULT_CLIENT_KEY, options: AxiosRequestConfig = {}) {
        return this._request(url, data, name, options, 'get');
    }

    post(url: string, data: any, name: string = REQUEST_DEFAULT_CLIENT_KEY, options: AxiosRequestConfig = {}) {
        return this._request(url, data, name, options, 'post');
    }

}


// 用法  引入 requestserver  直接调用方法即可
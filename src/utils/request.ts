/**
 * 此工具废弃
 */

import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance, AxiosRequestConfig, Method, AxiosResponse } from 'axios'

@Injectable()
export class CustomeRequest {
    public instance: AxiosInstance;
    constructor(
        private configService: ConfigService
    ) {
        this.instance = axios.create({
            baseURL: this.configService.get<string>('otherServer.baseUrl'),
            timeout: this.configService.get<number>('otherServer.timeout', 30000),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });

        this.interceptor();
    }

    interceptor() {
        //Add a request interceptor
        this.instance.interceptors.request.use(function (config) {
            // Do something before request is sent         
            // const token = store.state.user.userInfo.token;
            // config.headers.Authorization = token;
            // delete config.data.time;         
            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });

        // Add a response interceptor
        this.instance.interceptors.response.use(function (response) {
            // Do something with response data
            return response;
        }, function (error) {
            return Promise.reject(error);
        });
    }

    _request(url: string, params: any, options: AxiosRequestConfig, method: Method): Promise<AxiosResponse> {
        return new Promise((resolve, reject) => {
            let data = {}
            if (method == 'get') {
                data = { params }
            }
            if (method == 'post') {
                data = { data: params }
            }
            this.instance({
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

    get(url: string, data: any, options: AxiosRequestConfig = {}) {
        return this._request(url, data, options, 'get');
    }
    
    post(url: string, data: any, options: AxiosRequestConfig = {}) {
        return this._request(url, data, options, 'post');
    }

}
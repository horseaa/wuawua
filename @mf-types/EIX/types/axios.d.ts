/*
 * @Description:
 * @Author: Edward
 * @Date: 2024-01-03 10:04:22
 * @LastEditors: Edward
 * @LastEditTime: 2024-04-16 09:54:36
 */
import { AxiosPromise, AxiosRequestConfig } from 'axios';
export declare function setBaseURLHandler(baseUrl: string): void;
export default function (config: AxiosRequestConfig): AxiosPromise<any>;
export declare function setExpiredHandler(callback: (args: any) => void): void;
export declare function setRefreshTokenCallback(callback: () => Promise<any>): void;

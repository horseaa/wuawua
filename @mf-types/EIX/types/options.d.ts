/*
 * @Description:
 * @Author: Edward
 * @Date: 2024-01-03 10:04:22
 * @LastEditors: Edward
 * @LastEditTime: 2024-01-11 10:10:17
 */
export interface IAxiosInitConfig {
    baseURL?: string;
    platType?: '4C' | '4J';
    jAppName?: string;
    context?: string;
    currentRouter?: any;
    powerByQianKun: boolean;
  loaderCallbackHandler?: () => void;
  messageService?: any;
}
/**
 * 初始化EI
 * @param options
 */
export declare function init(options: IAxiosInitConfig): void;
/**
 *
 * @returns 获取初始化配置
 */
export declare function getConfig(): IAxiosInitConfig | null;

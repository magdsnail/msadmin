import crypto from 'crypto'

interface TimeOptions {
    y?: string;
    m?: string;
    d?: string;
    h?: string;
    minute?: string;
    second?: string;
    ymd?: string;
    hms?: string;
}

interface Params {
    [key: string]: any
}

export default {
    /**
    * 返回时间戳从1970年1月1日00:00:00至今的秒数
    */
    timesTamp(): string {
        return `${Date.now() / 1000 | 0}`;
    },

    /**
    * md5 算法
    * @param str 
    * @param encoding 
    * inputEncoding: crypto.Utf8AsciiLatin1Encoding = 'utf8'
    */
    md5(str: string) {
        return crypto.createHash('md5').update(str).digest('hex');
    },

    /**
    * sha1 算法
    * @param str 
    */
    sha1(str: string) {
        return crypto.createHash('sha1').update(str).digest('hex');
    },

    /**
    * sha256 算法
    * @param str 
    * @param key 
    */
    sha256(str: string, key: string) {
        return crypto.createHmac('sha256', key).update(str).digest('hex');
    },

    /**
     * 
     * @param time 
     * @param str 
     * @param timestr 
     * @param flag 
     */
    formatTime(time: Date = new Date(), str: string = '-', timestr: string = ':', flag: boolean = true): TimeOptions {
        const timeInte = new Date(time);
        let item: TimeOptions = {};
        if (flag) {
            let y = timeInte.getFullYear();
            let m = `0${timeInte.getMonth() + 1}`.slice(-2);
            let d = `0${timeInte.getDate()}`.slice(-2);

            let h = `0${timeInte.getHours()}`.slice(-2);
            let minute = `0${timeInte.getMinutes()}`.slice(-2);
            let second = `0${timeInte.getSeconds()}`.slice(-2);

            item.y = `${y}`;
            item.m = `${m}`;
            item.d = `${d}`;
            item.h = `${h}`;
            item.minute = `${minute}`;
            item.second = `${second}`;
            item.ymd = [`${y}`, `${m}`, `${d}`].join(str);
            item.hms = [`${h}`, `${minute}`, `${second}`].join(timestr);
        } else {
            let timeNeed = timeInte.toISOString();
            let timeShow = timeNeed.split('T');
            let yeaMonDay = timeShow[0].split('-');
            item.y = `${yeaMonDay[0]}`;
            item.m = `${yeaMonDay[1]}`;
            item.d = `${yeaMonDay[2]}`;
            item.ymd = `${yeaMonDay[0]}${str}${yeaMonDay[1]}${str}${yeaMonDay[2]}`;
            item.hms = timeShow[1].split('.')[0];
        }
        return item;
    },

    /**
    * 排序 字典正序
    * @param obj 
    */
    dicSort(obj: Params): Params {
        let keys = Object.keys(obj);
        keys.sort();

        const ret: Params = {};
        for (let v of keys) {
            if (obj[v]) {
                ret[v] = obj[v]
            }
        }

        return ret;
    },

    /**
     * 拼接
     * @param obj 
     */
    queryString(obj: Params, sep: string = '&', eq: string = '='): string {
        let res = [];
        for (let k in obj) {
            res.push(`${k}${eq}${obj[k]}`);
        }

        return res.join(`${sep}`);
    },

    //yyyy-MM-dd hh:mm:ss
    formatDate(dt: Date, fmt: string): string {
        const o = {
            "M+": dt.getMonth() + 1, //月份
            "d+": dt.getDate(), //日
            "h+": dt.getHours(), //小时
            "m+": dt.getMinutes(), //分
            "s+": dt.getSeconds(), //秒
            "q+": Math.floor((dt.getMonth() + 3) / 3), //季度
            "S": dt.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },

     /**
     * 计算分页
     * @param total 
     * @param pageSize 
     * @param page 
     * @returns 
     */
      getPagination(
        total: number,
        page: number,
        size: number) {
        const pages = Math.ceil(total / size)
        return {
            total,
            page,
            size,
            pages,
        }
    }

}
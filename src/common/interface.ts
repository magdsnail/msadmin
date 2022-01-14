export interface ConditonData {
    [key: string | number]: any
}

export interface UserInfoIE {
    user_id: string;
    username: string;
    nickname: string;
    department_id?: [string];//部门数据权限
    perms?: [string];//验证之后追加
}

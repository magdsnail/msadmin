import { ApiProperty } from "@nestjs/swagger";

export class UserInfoItem {
    @ApiProperty({ description: '用户id', example: 1 })
    id: number;

    @ApiProperty({ description: '用户名', example: 'magsnail' })
    username: string;

    @ApiProperty({ description: '手机号', example: '13088888888' })
    phone: string;

    @ApiProperty({ description: '创建时间', example: '2021-07-21' })
    created: Date

    @ApiProperty({ description: '更新时间', example: '2021-07-21' })
    updated: Date
}

export class UserInfoVO {
    @ApiProperty({ type: UserInfoItem })
    info: UserInfoItem
}

export class UserInfoResponse {
    @ApiProperty({ description: '状态码', example: 200, })
    code: number

    @ApiProperty({
        description: '数据',
        type: () => UserInfoVO, example: UserInfoVO,
    })
    data: UserInfoVO

    @ApiProperty({ description: '请求结果信息', example: '请求成功' })
    msg: string
}

export class ImageCaptcha {
    @ApiProperty({ description: 'base64图片编码' })
    img: string

    @ApiProperty({ description: 'uuid码' })
    uuid: string
}

export class ImageInfoVO {
    @ApiProperty({ type: ImageCaptcha })
    info: ImageCaptcha
}

export class ResImageCaptcha {
    @ApiProperty({ description: '状态码', example: 200, })
    code: number

    @ApiProperty({
        description: '数据',
        type: () => ImageInfoVO, example: ImageInfoVO,
    })
    data: ImageInfoVO

    @ApiProperty({ description: '请求结果信息', example: '请求成功' })
    msg: string
}
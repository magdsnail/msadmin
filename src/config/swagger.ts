import { registerAs } from '@nestjs/config';
export interface EnvSwaggerOptions {
	title: string;
	setupUrl: string;
	desc?: string;
	prefix: string;
	version: string;
}

export default registerAs('EnvSwaggerOption', (): EnvSwaggerOptions => ({
		title: process.env.SWAGGER_UI_TITLE, // swagger标题
		desc: process.env.SWAGGER_UI_TITLE_DESC, // swagger描述
		version: process.env.SWAGGER_API_VERSION, // swagger api 版本,自定义的
		setupUrl: process.env.SWAGGER_SETUP_PATH, // UI文档路径
		prefix: process.env.SWAGGER_ENDPOINT_PREFIX, // 接口聚合前缀,在nest用全局prefix,但是丢给swagger定义也不冲突
	})
);
export interface EnvironmentVariables {
	PORT: number;

	DATABASE_URL: string;

	JWT_ACCESS_SECRET: string;
	JWT_REFRESH_SECRET: string;

	MAIL_HOST: string;
	MAIL_PORT: number;
	MAIL_USER: string;
	MAIL_PASS: string;
}

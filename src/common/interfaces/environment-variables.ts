export interface EnvironmentVariables {
	PORT: number;

	DATABASE_URL: string;

	JWT_ACCESS_SECRET: string;
	JWT_REFRESH_SECRET: string;
}

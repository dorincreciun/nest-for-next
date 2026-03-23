import { Module } from '@nestjs/common';
import { PrismaModule } from './module/prisma/prisma.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';
import { TokenModule } from './module/token/token.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		TokenModule,
	],
})
export class AppModule {}

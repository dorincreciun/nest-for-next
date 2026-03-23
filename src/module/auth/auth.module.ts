import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';
import { HashService } from './services/hash.service';
import { UserModule } from '../user/user.module';

@Module({
	imports: [TokenModule, UserModule],
	providers: [AuthService, HashService],
	controllers: [AuthController],
})
export class AuthModule {}

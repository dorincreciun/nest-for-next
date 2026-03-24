import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {TokenService} from "../token/token.service";

@Module({
	// imports: [TokenService],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}

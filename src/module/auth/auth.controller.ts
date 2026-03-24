import {Body, Controller, Post} from '@nestjs/common';
import {RegisterDto, ActivateDto} from './dto';
import {AuthService} from './services/auth.service';
import type {ServerResponse} from "../../common/interfaces";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/register')
	async register(@Body() registerDto: RegisterDto): Promise<ServerResponse<string>> {
		const data = await this.authService.register(registerDto);
		return {
			success: true,
			messages: [data.message],
			data: data.email
		}
	}

	@Post("/activate-account")
	async activateAccount(@Body() dto: ActivateDto) {
		const data = await this.authService.activateAccount(dto)

		return {
			success: true,
			messages: [data.message]
		}
	}
}

import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@Post('/register')
	async register(@Body() registerDto: RegisterDto): Promise<any> {
		return await this.authService.register(registerDto);
	}
}

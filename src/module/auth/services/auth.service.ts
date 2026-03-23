import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { UserService } from '../../user/user.service';
import { TokenService } from '../../token/token.service';
import { HashService } from './hash.service';
import { MailService } from '../../mail/mail.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly hashService: HashService,
		private readonly mailService: MailService,
	) {}

	async register(dto: RegisterDto) {
		const existingUser = await this.userService.user({ email: dto.email });
		if (existingUser) {
			throw new ConflictException('Acest email este deja folosit');
		}

		const hashedPassword = await this.hashService.hashPassword(dto.password);
		const { password, ...userData } = dto;

		try {
			const newUser = await this.userService.create({
				...userData,
				hashedPassword,
			});

			const activationCode = this.tokenService.generateActivationToken();

			await this.userService.setActivationToken({
				token: activationCode,
				type: 'EMAIL_VERIFICATION',
				expiresAt: new Date(Date.now() + 1000 * 60 * 15),
				user: { connect: { id: newUser.id } },
			});

			await this.mailService.sendVerificationEmail(newUser.email, activationCode);

			return {
				message: 'Cont creat. Te rugăm să verifici email-ul pentru activare.',
				userId: newUser.id,
			};
		} catch (error) {
			throw new InternalServerErrorException('A apărut o eroare la crearea contului.');
		}
	}
}

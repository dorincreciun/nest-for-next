import {
	BadRequestException,
	ConflictException,
	GoneException,
	Injectable,
	InternalServerErrorException,
	Logger
} from '@nestjs/common';
import {ActivateDto, RegisterDto} from '../dto';
import {UserService} from '../../user/user.service';
import {TokenService} from '../../token/token.service';
import {HashService} from './hash.service';
import {MailService} from '../../mail/mail.service';
import {randomInt} from "crypto";
import {VerificationTokenType} from "../../../generated/prisma/enums";
import {ActivateAccountResponse, RegisterResponse} from "../interfaces";

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private readonly userService: UserService,
		private readonly tokenService: TokenService,
		private readonly hashService: HashService,
		private readonly mailService: MailService,
	) {}

	async register(dto: RegisterDto): Promise<RegisterResponse> {
		const { email, password, ...restOfUserData } = dto;

		const existUser = await this.userService.user({email})
		if(existUser) {
			throw new ConflictException("Acest email este deja inregistrat")
		}

		try {
			const verificationToken = this.generateVerificationToken()
			const hashedPassword = await this.hashService.hashPassword(password)

			await this.userService.create({
				userData: { ...restOfUserData, email, hashedPassword },
				verificationToken: {
					token: verificationToken,
					type: VerificationTokenType.EMAIL_VERIFICATION,
					expiresAt: this.getTokenExpirationDate(),
				}
			});

			this.sendVerificationToken(email, verificationToken)

			return {
				message: 'Cont creat cu succes. Verifică email-ul pentru activare.',
				email
			}

		} catch (e) {
			this.logger.error(`Registration error for ${email}: ${e.message}`);
			throw new InternalServerErrorException("A apărut o eroare la înregistrare");
		}
	}

	async activateAccount(dto: ActivateDto): Promise<ActivateAccountResponse> {
		const {email, verificationToken} = dto

		const existUser = await this.userService.user({email})
		if(!existUser) {
			throw new ConflictException("Acest email nu este inregistrat")
		}

		if (existUser.isVerified) {
			return { message: "Contul este deja activat. Te poți loga." };
		}

		const token = await this.validateOrThrowToken(email, verificationToken);

		try {
			await this.userService.activateUserAndRemoveToken(existUser.id, token.id);

			return { message: "Cont activat cu succes!" };
		} catch (e) {
			this.logger.error(`Activation error: ${e.message}`);
			throw new InternalServerErrorException("Eroare la activarea contului.");
		}

	}

	private async validateOrThrowToken(email: string, tokenValue: string) {
		const token = await this.userService.findVerificationToken(email, tokenValue);

		if (!token) {
			throw new BadRequestException("Codul de verificare este invalid.");
		}

		if (new Date() > token.expiresAt) {
			await this.userService.deleteVerificationToken(token.id);

			throw new GoneException("Codul a expirat. Te rugăm să generezi unul nou.");
		}

		return token;
	}

	private sendVerificationToken(email: string, token: string) {
		this.mailService
			.sendVerificationEmail(email, token)
			.then(() => {
				this.logger.log(`Email de activare trimis cu succes către: ${email}`);
			})
			.catch((error) => {
				this.logger.error(
					`Eșec la trimiterea email-ului de activare către ${email}: ${error.message}`,
					error.stack
				);
			});
	}

	private generateVerificationToken() {
		return randomInt(100000,900000).toString()
	}

	private getTokenExpirationDate(): Date {
		return new Date(Date.now() + 24 * 60 * 60 * 1000);
	}
}
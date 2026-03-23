import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../common/interfaces';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailService {
	private transporter;

	constructor(private configService: ConfigService<EnvironmentVariables>) {
		this.transporter = createTransport({
			host: this.configService.get('MAIL_HOST'),
			port: this.configService.get('MAIL_PORT'),
			secure: true,
			auth: {
				user: this.configService.get('MAIL_USER'),
				pass: this.configService.get('MAIL_PASS'),
			},
		});
	}

	async sendVerificationEmail(email: string, token: string) {
		await this.transporter.sendMail({
			from: '"No Reply" <noreply@example.com>',
			to: email,
			subject: 'Activare Cont',
			html: `Codul tău de activare este: <b>${token.split('').join('-')}</b>.`,
		});
	}
}

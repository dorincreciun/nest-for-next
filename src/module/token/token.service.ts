import { Injectable } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../common/interfaces';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
	constructor(
		private readonly configService: ConfigService<EnvironmentVariables>,
		private readonly jwtService: JwtService,
	) {}

	async generateRefreshToken(payload: JwtPayloadInterface): Promise<string> {
		return this.jwtService.signAsync(payload, {
			secret: this.configService.get('JWT_REFRESH_SECRET'),
			expiresIn: '1h',
		});
	}

	async generateAccessToken(payload: JwtPayloadInterface): Promise<string> {
		return this.jwtService.signAsync(payload, {
			secret: this.configService.get('JWT_ACCESS_SECRET'),
			expiresIn: '15m',
		});
	}
}

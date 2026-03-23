import { compare, hash } from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
	private readonly SALT_ROUNDS = 10;

	async hashPassword(password: string): Promise<string> {
		return hash(password, this.SALT_ROUNDS);
	}

	async comparePassword(password: string, hash: string): Promise<boolean> {
		return compare(password, hash);
	}
}

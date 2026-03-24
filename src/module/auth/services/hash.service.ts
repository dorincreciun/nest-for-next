import {compare, hash as bHash} from 'bcrypt';
import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {HASH_ERRORS} from "../constants";

@Injectable()
export class HashService {
	private readonly SALT_ROUNDS = 10;

	async hashPassword(password: string): Promise<string> {
		try {
			return bHash(password, this.SALT_ROUNDS);
		}catch (e) {
			throw new InternalServerErrorException(HASH_ERRORS.HASH_FAILED);
		}
	}

	async comparePassword(password: string, hash: string): Promise<boolean> {
		try {
			return await compare(password, hash);
		} catch (error) {
			throw new InternalServerErrorException(HASH_ERRORS.COMPARE_FAILED);
		}
	}
}

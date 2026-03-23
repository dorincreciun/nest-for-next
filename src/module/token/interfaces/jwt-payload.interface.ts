import { UserRole } from '../../../generated/prisma/enums';

export interface JwtPayloadInterface {
	sub: number;
	email: string;
	role: UserRole;
	is2fa: boolean;
	isVerified: boolean;
}

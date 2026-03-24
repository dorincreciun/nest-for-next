import {Injectable, InternalServerErrorException} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {Prisma, User, VerificationTokenType} from '../../generated/prisma/client';
import {CreateUserProps} from "./interfaces";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

    async user(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });
    }

    async findVerificationToken(email: string, token: string) {
        return this.prisma.verificationToken.findFirst({
            where: {
                token: token,
                user: {email: email},
                type: VerificationTokenType.EMAIL_VERIFICATION
            }
        })
    }

    async activateUserAndRemoveToken(userId: number, tokenId: number) {
        return this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: userId},
                data: { isVerified: true}
            }),

            this.prisma.verificationToken.delete({
                where: {id: tokenId}
            })
        ])
    }

    async create({userData, verificationToken}: CreateUserProps) {
        try {
            return await this.prisma.$transaction(async (trx) => {
                const user = await trx.user.create({data: userData});

                await trx.verificationToken.create({
                    data: {
                        token: verificationToken.token,
                        type: verificationToken.type,
                        expiresAt: verificationToken.expiresAt,
                        user: {connect: {id: user.id}},
                    },
                });

                return {...user, verificationToken: verificationToken.token};
            });
        } catch (error) {
            throw new InternalServerErrorException('Eroare la salvarea utilizatorului în baza de date.');
        }
    }

    async setVerificationToken(data: Prisma.VerificationTokenCreateInput) {
        return this.prisma.verificationToken.create({data});
    }

    async deleteVerificationToken(tokenId: number) {
        return this.prisma.verificationToken.delete({
            where: {id: tokenId}
        })
    }
}

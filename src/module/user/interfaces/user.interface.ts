import {VerificationTokenCreateInput} from "../../../generated/prisma/models/VerificationToken";
import {UserCreateInput} from "../../../generated/prisma/models/User";

export interface CreateUserProps {
    userData: UserCreateInput
    verificationToken: Omit<VerificationTokenCreateInput, "user">
}
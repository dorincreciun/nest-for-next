import {IsEmail, IsNotEmpty, IsString, Length, Matches, MinLength} from "class-validator";

export class ActivateDto {
    @IsEmail({}, { message: 'Adresa de email nu este validă.' })
    email: string

    @IsNotEmpty({ message: 'Codul de verificare este obligatoriu.' })
    @IsString()
    @Matches(/^[0-9]+$/, { message: 'Codul trebuie să conțină doar cifre.' })
    @Length(6, 6, { message: 'Codul trebuie să aibă exact 6 cifre.' })
    verificationToken: string
}
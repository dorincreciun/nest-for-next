import {
	IsEmail,
	IsNotEmpty,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class RegisterDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(255)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message:
			'Parola este prea slabă! Trebuie să conțină cel puțin o literă mare, o literă mică și un număr sau caracter special.',
	})
	password: string;

	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(150)
	firstName: string;

	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(150)
	lastName: string;
}

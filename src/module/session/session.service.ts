import {Injectable} from "@nestjs/common";
import {TokenService} from "../token/token.service";
import {CreateSessionProps} from "./interface";

@Injectable()
export class SessionService {
    constructor(private readonly tokenService: TokenService) {
    }

    async createSession(data: CreateSessionProps) {}
}
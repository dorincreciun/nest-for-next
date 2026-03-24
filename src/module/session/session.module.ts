import {Module} from "@nestjs/common";
import {SessionService} from "./session.service";
import {TokenService} from "../token/token.service";

@Module({
    imports: [TokenService],
    providers: [SessionService],
    exports: [SessionService],
})
export class SessionModule {}
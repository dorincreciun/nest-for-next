import {Module} from '@nestjs/common';
import {PrismaModule} from './module/prisma/prisma.module';
import { AuthModule } from './module/auth/auth.module';
import { UserModule } from './module/user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule],
})
export class AppModule {}

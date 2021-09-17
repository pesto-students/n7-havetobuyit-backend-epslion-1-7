import { AuthGuard } from '@nestjs/passport';
import { GoogleStrategyName } from '../strategies/google.strategy';

export class GoogleAuthGuard extends AuthGuard(GoogleStrategyName) {}

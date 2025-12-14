
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    const jwtSecret = process.env.JWT_SECRET || 'your-development-secret-key-change-in-production';
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      ignoreExpiration: false, // This ensures JWT expiration is checked
    });

    // Log the secret status for debugging (but not the actual secret)
    if (!process.env.JWT_SECRET) {
      this.logger.warn('JWT_SECRET environment variable is not set. Using development secret. Do NOT use this in production!');
    } else {
      this.logger.log('JWT_SECRET is properly configured');
    }
  }

  async validate(payload: any) {
    // The payload contains the user data from the token
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}

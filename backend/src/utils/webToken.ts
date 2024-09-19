import { DotenvConfig } from '../config/env.config';
import { type IJwtOptions, type IJwtPayload } from '../interface/jwt.interfaces';
import jwt from 'jsonwebtoken';

// Modified sign function without role
const sign = (user: IJwtPayload, options: IJwtOptions): string => {
  return jwt.sign(
    {
      id: user.id,  // Only the user ID is included
    },
    options.secret,
    {
      expiresIn: options.expiresIn,
    }
  );
};

// Verify function remains unchanged
const verify = (token: string, secret: string): any => {
  return jwt.verify(token, secret);
};

// Modified generateAccessToken function without role
const generateAccessToken = (user: IJwtPayload): string => {
  return sign(
    user,
    {
      expiresIn: DotenvConfig.ACCESS_TOKEN_EXPIRES_IN,
      secret: DotenvConfig.ACCESS_TOKEN_SECRET,
    }
  );
};

// Modified generateTokens function without role
const generateTokens = (user: IJwtPayload): { accessToken: string; refreshToken: string } => {
  const accessToken = sign(
    user,
    {
      expiresIn: DotenvConfig.ACCESS_TOKEN_EXPIRES_IN,
      secret: DotenvConfig.ACCESS_TOKEN_SECRET,
    }
  );
  const refreshToken = sign(
    user,
    {
      expiresIn: DotenvConfig.REFRESH_TOKEN_EXPIRES_IN,
      secret: DotenvConfig.REFRESH_TOKEN_SECRET,
    }
  );
  return { accessToken, refreshToken };
};

export default {
  sign,
  verify,
  generateAccessToken,
  generateTokens,
};

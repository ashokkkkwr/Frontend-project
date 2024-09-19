import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/HttpException.utils';
import jwt from '../utils/webToken'
import { DotenvConfig } from '../config/env.config';



export const authentication = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokens = req.headers.authorization?.split(' ')
    console.log("🚀 ~ return ~ tokens:", tokens)
    try {
      if (!tokens) {
        throw HttpException.unauthorized("not authorized")
      }
      
      const mode = tokens[0]
      const accessToken = tokens[1]
      if (mode !== 'Bearer' || !accessToken) throw HttpException.unauthorized("unAuthorized")
      const payload = jwt.verify(accessToken, DotenvConfig.ACCESS_TOKEN_SECRET)
      if (payload) {
        req.user = payload
    
        next()
      } else {
        throw HttpException.unauthorized("unauthorized.")
      }
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        next(HttpException.unauthorized('tokenExpired.'))
        return
      }
  }
}
}

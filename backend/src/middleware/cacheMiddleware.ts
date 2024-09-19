import { Request, Response, NextFunction } from "express";
import { redis } from "../../redisClient";

interface CustomResponse extends Response {
  sendResponse?: (body: any) => Response;
}

const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = `cache:${req.originalUrl}`;
  const cachedData = await redis.get(key);
  console.log("🚀 ~ cacheMiddleware ~ key:", key);
  if (cachedData) {
    return res.send(JSON.parse(cachedData));
  }

  const customRes = res as CustomResponse;
  customRes.sendResponse = res.send.bind(res);

  customRes.send = function (this: CustomResponse, body: any) {
    redis.set(key, JSON.stringify(body), "EX", 60 * 5);
    return this.sendResponse!(body);
  };
  next();
};
export default cacheMiddleware;

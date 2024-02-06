import { verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { env } from "../env";
import { MyContext, UserRole } from "../lib";
import UserModel from "../models/user/UserModel";
import { Request, Response } from "express";

export const authChecker: AuthChecker<MyContext> = async (
  { context },
  roles
) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    return false;
  }

  const token = authorization.split(" ")[1];
  const payload = verify(token, env.ACCESS_TOKEN_SECRET!) as any;

  if (!payload) {
    return false;
  }

  const user = await UserModel.findById(payload.userId).exec();

  if (
    !user ||
    user.isLocked ||
    user.isDeleted
  ) {
    return false;
  } else if (roles.length === 0 || (roles as UserRole[]).includes(user.role)) {
    context.payload = user;
    return true;
  } else {
    return false;
  }
};

export const routeAuth = async (req: Request, res: Response, next: any) => {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    res.send("unauthorized");
  }

  const token = authorization!.split(" ")[1];
  const payload = verify(token, env.ACCESS_TOKEN_SECRET!) as any;

  if (!payload) {
    res.send("unauthorized");
  }

  const user = await UserModel.findById(payload.userId).exec();

  if (user?.role === UserRole.GLOBAL_ADMIN) {
    next();
  } else {
    res.send("unauthorized");
  }
};

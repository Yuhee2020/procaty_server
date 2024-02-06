import { Request, Response } from "express";
import { env } from "../env";
import { verify } from "jsonwebtoken";
import UserModel from "../models/user/UserModel";
import Container from "typedi";
import {AuthService} from "../services/authService";

export const refreshToken = async (req: Request, res: Response) => {
  const _authService = Container.get(AuthService);

  const token = req.cookies[env.COOKIE_NAME!];
  if (!token) {
    return res.send({ ok: false, accessToken: "" });
  }

  let payload: any = null;
  try {
    payload = verify(token, env.REFRESH_TOKEN_SECRET!);
  } catch (err) {
    return res.send({ ok: false, accessToken: "" });
  }

  //token is valid and we can send back an accessToken
  const user = await UserModel.findById({ _id: payload.userId });

  if (!user || user.isLocked || user.isDeleted) {
    return res.send({ ok: false, accessToken: "" });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: "" });
  }

  _authService.sendRefreshToken(
    _authService.createRefreshToken(user),
    user,
    res
  );

  return res.send({
    ok: true,
    accessToken: _authService.createAccessToken(user),
  });
};

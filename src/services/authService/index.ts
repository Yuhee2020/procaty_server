import Logger from "bunyan";
import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { Inject, Service } from "typedi";
import { env } from "../../env";
import { createUHLogger } from "../../helpers";
import { UserRole } from "../../lib";
import { IUser } from "../../models";
import UserModel from "../../models/user/UserModel";
import {SignInUserResponse} from "../../graphql/user";
import {RefreshTokenResponse} from "../../graphql/common";
import {UserService} from "../userService";

@Service()
export class AuthService {
  protected readonly log: Logger = createUHLogger({ name: "authService" });

  @Inject(() => UserService)
  private readonly _userService: UserService;

  authenticateUser(
    user: IUser,
    firstTimeLogin: boolean,
    response: Response
  ): SignInUserResponse {
    this.sendRefreshToken(this.createRefreshToken(user), user, response);

    return {
      accessToken: this.createAccessToken(user),
      user,
      firstTimeLogin,
    };
  }

  createRefreshToken(user: IUser) {
    return sign(
      {
        userId: user.id,
        tokenVersion: user.tokenVersion,
      },
      env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
      }
    );
  }

  async payload(req: Request): Promise<IUser | null> {
    const authorization = req.headers["authorization"];
    const token = authorization?.split(" ")[1];

    if (!authorization || !token) return null;

    const payload = verify(token, env.ACCESS_TOKEN_SECRET!) as any;
    if (!payload) return null;

    const user = await UserModel.findById(payload.userId).exec();

    if (
      !user ||
      user.isLocked ||
      user.isDeleted
    ) {
      return null;
    } else {
      return user;
    }
  }

  createAccessToken(user: IUser, noExpiration?: boolean) {
    return noExpiration
      ? sign(
          {
            userId: user.id,
          },
          env.ACCESS_TOKEN_SECRET
        )
      : sign(
          {
            userId: user.id,
          },
          env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
          }
        );
  }

  sendRefreshToken(token: string, _user: IUser, res: Response) {
    res.cookie(env.COOKIE_NAME, token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax", // csrf
      secure: env.NODE_ENV === "development" ? false : true,
      domain: env.NODE_ENV === "development" ? "localhost" : env.COOKIE_DOMAIN,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1-year cookie
    });
  }

  async fetchAuthenticatedUser(request: Request): Promise<IUser | null> {
    const authorization = request.headers["authorization"];
    if (!authorization) return null;

    const token = authorization.split(" ")[1];

    const payload = verify(token, env.ACCESS_TOKEN_SECRET!) as any;
    if (!payload) return null;

    const user = await this._userService.findOne({
      _id: payload.userId,
    });

    if (!user) return null;

    if (user.isDeleted || user.isLocked || !user.emailVerified) {
        return null;
    }

    return user;
  }

  async refreshToken(
    req: Request,
    res: Response
  ): Promise<RefreshTokenResponse> {
    const rToken = req.cookies[env.COOKIE_NAME!];

    if (!rToken) {
      return { accessToken: "", ok: false };
    }

    let payload: any = null;

    try {
      payload = verify(rToken, env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      return { ok: false, accessToken: "" };
    }

    //token is valid and we can send back an accessToken
    const user = await this._userService.findOne({
      _id: payload.userId,
    });

    if (!user || user.tokenVersion !== payload.tokenVersion)
      return { accessToken: "", ok: false };

    if (user.isDeleted || user.isLocked || !user.emailVerified) {
        return { accessToken: "", ok: false };
      }

    this.sendRefreshToken(this.createRefreshToken(user), user, res);

    return { accessToken: this.createAccessToken(user), ok: true };
  }

  async revokeRefreshToken(user: IUser) {
    await user.updateOne({
      $inc: {
        tokenVersion: 1,
      },
    });
  }
}

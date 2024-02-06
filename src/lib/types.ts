import { Request, Response } from "express";
import { IUser } from "../models";

export type MyContext = {
  req: Request;
  res: Response;
  payload?: IUser;

  // userLoader: ReturnType<typeof createUserLoader>; for further optimmization
  // redis: Redis; mb
};

export type ErrorName =
  | "name"
  | "title"
  | "slug"
  | "sourceUrl"
  | "sourceId"
  | "invalid"
  | "general"
  | "email"
  | "openUntil"
  | "user"
  | "coupon"
  | "exceeded"
  | "exists"
  | "expired"
  | "activity"
  | "tag"

export type MailAction = "signUp" | "resetPassword" | "registrationByAdmin";

export type EnumRepoName = "jobCategory" | "seniority" | "employmentType";


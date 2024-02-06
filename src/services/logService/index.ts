import Logger from "bunyan";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { ClientSession } from "mongoose";
import { Inject, Service } from "typedi";
import { env } from "../../env";
import { createUHLogger } from "../../helpers";
import { UserRole } from "../../lib";
import LoginLogModel, {
  ILoginLog,
  ILoginLogModel
} from "../../models/loginLog/LoginLogModel";
import Utils from "../../utils";
import {IUser} from "../../models";
import {PaginationOptionsArgs} from "../../graphql/common";

@Service()
export class LogService {
  constructor(
    @Inject("LOGIN_LOG") private readonly _logRepository: ILoginLogModel
  ) {}

  protected readonly log: Logger = createUHLogger({ name: "logService" });

  async fetch(paginationOptions: PaginationOptionsArgs): Promise<ILoginLog[]> {
    const sortObj: any = {};
    if (paginationOptions.sort) {
      sortObj[paginationOptions.sort.field] = paginationOptions.sort.sortBy;
    }
    const q = this._logRepository.find().sort(sortObj);
    if (paginationOptions.limit) q.limit(paginationOptions.limit);
    if (paginationOptions.skip) q.skip(paginationOptions.skip);

    return q.exec();
  }

  async addLogEntry(
    user: IUser,
    req: Request,
    session?: ClientSession
  ): Promise<boolean> {
    let log = await this.findLogEntry(user.id);
    const firstTimeLogin = !!!log;
    if (!log) log = new LoginLogModel();
    log.set({
      email: user.email,
      lastLoginDateStamp: new Date(),
      userId: user.id,
      lastLoginIP: Utils.getIPAddressFromRequest(req),
    });

    if (session) {
      await log.save({ session });
    } else {
      await log.save();
    }

    return firstTimeLogin;
  }

  async findLogEntry(
    userId: IUser["id"],
    populateUser?: boolean
  ): Promise<ILoginLog | null> {
    const q = this._logRepository.findOne({ userId });
    if (populateUser) q.populate("userId");
    return q.exec();
  }
}

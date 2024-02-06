import * as Mongoose from "mongoose";
import { IUser } from "..";

export interface ILoginLogModel extends Mongoose.Model<ILoginLog> {}

export interface ILoginLog extends Mongoose.Document {
  email: string;
  userId: IUser | string;
  lastLoginIP: string;
  lastLoginDateStamp: Date;
}

const LoginLogSchema: Mongoose.Schema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastLoginIP: {
    type: String,
    required: true,
  },
  lastLoginDateStamp: {
    type: Date,
    required: true,
  },
});

export default Mongoose.model<ILoginLog>(
  "LoginLog",
  LoginLogSchema,
  "login_logs"
);

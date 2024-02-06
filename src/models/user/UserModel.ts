import * as Mongoose from "mongoose";
import {NotificationType, UserRole } from "../../lib";
import Utils from "../../utils";
import {
  FileSourceSchema,
  IFileSource,
} from "../schemas";

export interface IUserModel extends Mongoose.Model<IUser> {}

export interface IUser extends Mongoose.Document {
  email: string;
  hashedPassword: string;
  firstName?: string;
  emailVerified: boolean;
  emailVerificationKey?: string;
  emailVerificationKeyExpires?: Date;
  role: UserRole;
  tokenVersion: number;
  notificationTypes: NotificationType[];
  summary?: string;
  logo?: IFileSource;
  phone?: string;
  createdBy: IUser | string;
  updatedBy?: IUser | string;
  isDeleted: boolean;
  isLocked: boolean;
  createdAt: Date;
}


const UserSchema: Mongoose.Schema = new Mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      set: function(v: string) {
        return v.trim().toLowerCase();
      },
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    phone: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      required: true,
    },
    summary: {
      type: String,
    },
    logo: {
      type: FileSourceSchema,
    },
    emailVerificationKey: {
      type: String,
    },
    emailVerificationKeyExpires: {
      type: Date,
    },
    tokenVersion: {
      type: Number,
      required: true,
      default: 0,
    },
    role: {
      type: String,
      enum: Utils.convertEnumToArray(UserRole),
      required: true,
    },
    notificationTypes: {
      type: [String],
      enum: Utils.convertEnumToArray(NotificationType),
      required: true,
      default: [NotificationType.EMAIL],
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export default Mongoose.model<IUser>("User", UserSchema, "users");

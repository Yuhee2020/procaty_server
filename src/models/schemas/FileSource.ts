import * as Mongoose from "mongoose";
import { FileType } from "../../lib";
import Utils from "../../utils";
import { IUser } from "../user";

export interface IFileSource {
  fileName: string;
  url: string;
  public_id: string;
  type: FileType;
  mime?: string;
  createdBy: IUser | string;
  updatedBy?: IUser | string;
}

export const FileSourceSchema = new Mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Utils.convertEnumToArray(FileType),
      required: true,
    },
    mime: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

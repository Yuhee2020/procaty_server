import { IFileSource, IUser } from "../models";
import { ReadAccess } from "./enums";
import { ErrorName } from "./types";

export interface IServiceResult<T> {
  object?: T;
  error?: IErrorResponse;
  errors?: IErrorResponse[];
}

export interface IErrorResponse {
  name: ErrorName;
  message?: string;
}

import { Field, Float, Int, ObjectType, registerEnumType } from "type-graphql";
import {
  Gender,
  IErrorResponse,
  NotificationType,
  UserRole,
} from "../../lib";
import {
  IFileSource,
  IUser,
} from "../../models";
import {Address_Gql, ErrorResponse, File_Gql, Preference_GQL} from "../common";

registerEnumType(UserRole, {
  name: "UserRole",
});

@ObjectType()
export class User_GQL {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field()
  emailVerified: boolean;

  @Field(() => UserRole)
  role: UserRole;

  @Field({ nullable: true })
  summary?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field(() => File_Gql, { nullable: true })
  logo?: IFileSource;

  @Field(() => [String])
  notificationTypes: NotificationType[];

  @Field()
  isLocked: boolean;

  @Field()
  isDeleted: boolean;

  @Field()
  created_at: Date;
}

@ObjectType()
export class SignInUserResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => User_GQL, { nullable: true })
  user?: IUser;

  @Field(() => ErrorResponse, { nullable: true })
  error?: IErrorResponse;

  @Field({ nullable: true })
  firstTimeLogin?: boolean;

  @Field(() => String, { nullable: true })
  redirectTo?: string;
}

@ObjectType()
export class UsersWithCount {
  @Field(() => [User_GQL])
  users: IUser[];

  @Field(() => Int)
  total: number;
}

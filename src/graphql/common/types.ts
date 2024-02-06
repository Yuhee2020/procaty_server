import { Field, Float, Int, ObjectType, registerEnumType } from "type-graphql";
import {
  FileType,
  IErrorResponse,
} from "../../lib";
import { IUser } from "../../models";

registerEnumType(FileType, {
  name: "FileType",
});

@ObjectType()
export class Price_Gql {
  @Field()
  value: string;
}

@ObjectType()
export class MetaObjectType {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPrevPage: boolean;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  nextPage: number;

  @Field(() => Int)
  prevPage: number;
}


@ObjectType()
export class Preference_GQL {

  @Field(() => [String])
  jobCategories: string[];

  @Field(() => [String], { nullable: true })
  regions?: string[];
}

@ObjectType()
export class Address_Gql {

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  zipCode?: string;
}

@ObjectType()
export class AITools_Gql {
  @Field(() => Int)
  chatGptTokensLeft: number;

  @Field()
  chatGptTokensPeriodStart: Date;
}

@ObjectType()
export class File_Gql {
  @Field()
  fileName: string;

  @Field()
  url: string;

  @Field()
  public_id: string;

  @Field(() => String)
  type: FileType;

  @Field({ nullable: true })
  mime: string;
}

@ObjectType()
export class ErrorResponse {
  @Field()
  name: string;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType()
export class UserResponse {

  @Field(() => ErrorResponse, { nullable: true })
  error?: IErrorResponse;
}

@ObjectType()
export class SuccessErrorResponse {
  @Field()
  success: boolean;

  @Field(() => String, { nullable: true })
  redirectPath?: string;

  @Field(() => ErrorResponse, { nullable: true })
  error?: IErrorResponse;
}

@ObjectType()
export class PendingJobsResponse {
  @Field(() => [String], { nullable: true })
  pendingJobs?: string[];

  @Field(() => ErrorResponse, { nullable: true })
  error?: IErrorResponse;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  accessToken: string;

  @Field()
  ok: boolean;
}

@ObjectType()
export class ValueCounter {
  @Field()
  value: string;

  @Field(() => Int)
  total: number;
}

@ObjectType()
export class ExchangeRates_Gql {
  @Field()
  date: Date;

  @Field(() => Float)
  rubToEur: number;

  @Field(() => Float)
  rubToUsd: number;

  @Field(() => Float)
  usdToEur: number;

  @Field(() => Float)
  usdToRub: number;
}

@ObjectType()
export class Contacts_Gql {
  @Field({ nullable: true })
  linkedIn?: string;

  @Field({ nullable: true })
  twitter?: string;

  @Field({ nullable: true })
  telegram?: string;

  @Field({ nullable: true })
  youTube?: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  vk?: string;

  @Field({ nullable: true })
  instagram?: string;
}

import {
  IsEmail,
  IsEnum,
  IsIn,
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Field, InputType } from "type-graphql";
import {
  Gender,
  NotificationType, UserRole,
} from "../../lib";
import { FileInput } from "../common";

@InputType()
export class ContactSupportInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  message: string;
}

@InputType()
export class SubmitEnquiryInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  subject: string;

  @Field()
  message: string;
}

@InputType()
export class SetPreferencesInput {


  @Field(() => [String], { nullable: true })
  jobCategories?: string[]; //names

  @Field(() => [String], { nullable: true })
  regions?: string[];
}

@InputType()
export class SignInWithEmailInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MaxLength(64)
  password: string;
}

@InputType()
export class ResetPasswordByTokenInput {
  @Field()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @Field()
  @IsNotEmpty()
  token: string;
}

@InputType()
export class SignUpInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  @MaxLength(64)
  password: string;

  @Field(() => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

}

@InputType()
export class UpdateMySummaryInput {
  @Field(() => FileInput, { nullable: true })
  @ValidateNested()
  picture?: FileInput;

  @Field(() => String, { nullable: true })
  @IsEnum(Gender)
  gender?: Gender;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  summary?: string;

  @Field({ nullable: true })
  nationality?: string;

  @Field(() => [String], { nullable: true })
  languages?: string[];

  @Field({ nullable: true })
  birthDate?: Date;

  @Field(() => String, { nullable: true })
  countryId?: string;

  @Field(() => [String], { nullable: true })
  notificationTypes?: NotificationType[];

  @Field({ nullable: true })
  skype?: string;

  @Field({ nullable: true })
  linkedId?: string;

  @Field({ nullable: true })
  zoom?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  isSubscribedOnJobsMailing?: boolean;
}

@InputType()
export class UpdateUserInfoInput {
  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  skype?: string;

  @Field({ nullable: true })
  linkedId?: string;

  @Field({ nullable: true })
  zoom?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  applyForPartnership?: boolean;

  @Field(() => String, { nullable: true })
  countryId?: string;

  @Field({ nullable: true })
  city?: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  @MinLength(8)
  @MaxLength(64)
  newPassword: string;
}

@InputType()
export class SendContactInfoInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  subject: string;

  @Field({ nullable: true })
  telegram?: string;

  @Field()
  message: string;
}

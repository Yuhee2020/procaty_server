import { IsEnum, IsNotEmpty, IsPositive, Min } from "class-validator";
import { Field, InputType, Int } from "type-graphql";
import { FileType } from "../../lib";

@InputType()
export class FileInput {
  @Field({ nullable: true })
  fileName?: string;

  @Field()
  source: string;

  @Field(() => FileType, { nullable: true })
  type?: FileType;
}

@InputType()
export class InputAddress_Gql {
  @Field(() => String, { nullable: true })
  countryId?: string;

  @Field(() => String, { nullable: true })
  zipCode?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  city?: string;
}

@InputType()
export class PaginationSortArgs {
  @Field()
  field: string;

  @Field()
  sortBy: string;
}

@InputType()
export class PaginationOptionsArgs {
  @Field(() => PaginationSortArgs, { nullable: true })
  sort?: PaginationSortArgs;

  @Field(() => Int, { nullable: true })
  @IsPositive()
  limit?: number;

  @Field(() => Int, { nullable: true })
  @Min(0)
  skip?: number;
}

@InputType()
export class CLFileInput {
  @Field()
  @IsNotEmpty()
  publicId: string;

  @Field()
  @IsNotEmpty()
  url: string;

  @Field()
  @IsNotEmpty()
  filename: string;

  @Field(() => String)
  @IsEnum(FileType)
  type: FileType;
}

@InputType()
export class ContactsInput {
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

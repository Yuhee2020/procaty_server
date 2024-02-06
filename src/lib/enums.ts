export enum UserRole {
  GLOBAL_ADMIN = "GLOBAL_ADMIN",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  CUSTOMER = "CUSTOMER",
  BUSINESS = "BUSINESS",
  PROMOTER = "PROMOTER",
}

export enum ReactionKind {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
}

export enum ErrorCode {
  _403 = "FORBIDDEN",
  _404 = "NOT_FOUND",
  _500 = "INTERNAL_ERROR",
  _400 = "BAD_INPUT",
}



export enum Gender {
  F = "Female",
  M = "Male",
  N = "not specified",
}

export enum PublishStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum FileType {
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
  IMAGE = "IMAGE",
}

export enum NotificationType {
  EMAIL = "EMAIL",
}

export enum ReadAccess {
  UNANYMOUS = "UNANYMOUS",
  AUTHORIZED = "AUTHORIZED",
  FELLOW = "FELLOW",
}
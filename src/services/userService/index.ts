import * as argon2 from "argon2";
import Logger from "bunyan";
import { isEmail } from "class-validator";
import { Request } from "express";
import mongoose, { FilterQuery, UpdateQuery } from "mongoose";
import { Inject, Service } from "typedi";
import {
  ContactSupportInput,
  SetPreferencesInput,
  SignUpInput,
  UpdateMySummaryInput,
  UpdatePasswordInput,
  UpdateUserInfoInput,
} from "../../graphql/user/inputs";
import { createUHLogger } from "../../helpers";
import {
  CHAT_GPT_TOKENS_PER_MONTH_FOR_FELLOW,
  CHAT_GPT_TOKENS_PER_MONTH_FOR_NON_FELLOW,
  ErrorCode,
  FileType,
  IErrorResponse,
  IServiceResult,
  MailAction,
  NotificationType,
  UserRole,
  confirmYourEmail,
  emailAlreadyExistsError,
  invalidLogin,
  oldPasswordIsInvalid,
} from "../../lib";
import {
  IFileSource,
  IUser,
  IUserModel,
} from "../../models";
import UserModel from "../../models/user/UserModel";
import Utils from "../../utils";
import {LogService} from "../logService";
import {SuccessErrorResponse} from "../../graphql/common";
import {MailService} from "../mailService";
import {AuthService} from "../authService";

@Service()
export class UserService {
  constructor(
    @Inject("USER") private readonly _userRepository: IUserModel,
  ) {}

  @Inject(() => LogService)
  private readonly _logService: LogService;
  //
  // @Inject(() => CountryService)
  // private readonly _countryService: CountryService;
  //
  @Inject(() => MailService)
  private readonly _mailService: MailService;


  //
  // @Inject(() => FileService)
  // private readonly _fileService: FileService;
  //
  @Inject(() => AuthService)
  private readonly _authService: AuthService;
  //
  // @Inject(() => PreferenceService)
  // private readonly _prefService: PreferenceService;

  // protected readonly log: Logger = createUHLogger({ name: "userService" });

  // async uploadFile(src: string, actor: IUser): Promise<string> {
  //   const { url } = await this._fileService.upload(
  //     src,
  //     "user-files",
  //     actor.firstName + " " + actor.lastName
  //   );
  //
  //   return url;
  // }
  //
  // async spendChatGptToken(
  //   actor: IUser,
  //   chatPayload: GetChatGPTInput
  // ): Promise<void> {
  //   if (Utils.isAdmin(actor)) return;
  //
  //   const isPromoter = actor.role === UserRole.PROMOTER;
  //
  //   const chatGptTokensLeft = isPromoter
  //     ? actor.partnerSettings?.chatGptTokensLeft
  //     : actor.customerInfo?.chatGptTokensLeft;
  //
  //   if (chatGptTokensLeft && chatGptTokensLeft <= 0) {
  //     throw new Error(`Cannot spend ChatGPT tokens!`);
  //   }
  //
  //   if (isPromoter) {
  //     await this._userRepository
  //       .findByIdAndUpdate(actor.id, {
  //         $inc: {
  //           ["partnerSettings.chatGptTokensLeft"]: -1,
  //         },
  //       })
  //       .exec();
  //   } else {
  //     await this._userRepository
  //       .findByIdAndUpdate(actor.id, {
  //         $inc: {
  //           ["customerInfo.chatGptTokensLeft"]: -1,
  //         },
  //         ["resume.agreedAIConditions"]: true,
  //       })
  //       .exec();
  //   }
  //
  //   const userMetricsExist = await this._metricsRepository
  //     .findOne({ user: actor.id })
  //     .exec();
  //
  //   const chatGptRequestPayload: IChatGptRequestPayload = {
  //     type: chatPayload.request,
  //     params: chatPayload.params
  //       .filter((param) => !!param.value)
  //       .map((param) => ({
  //         key: param.key,
  //         value: param.value!,
  //         type: param.type,
  //       })),
  //   };
  //
  //   if (!userMetricsExist) {
  //     const newMetrics = new MetricsModel();
  //     newMetrics.set({
  //       user: actor.id,
  //       chatGptTokensUsed: 1,
  //       chatGptLastUsed: new Date(),
  //       chatGptRequestPayloads: [chatGptRequestPayload],
  //     });
  //
  //     await newMetrics.save();
  //   } else {
  //     userMetricsExist.set({
  //       chatGptTokensUsed:
  //         userMetricsExist.chatGptTokensUsed !== undefined
  //           ? userMetricsExist.chatGptTokensUsed + 1
  //           : 1,
  //       chatGptLastUsed: new Date(),
  //       chatGptRequestPayloads: userMetricsExist.chatGptRequestPayloads
  //         ? [...userMetricsExist.chatGptRequestPayloads, chatGptRequestPayload]
  //         : [chatGptRequestPayload],
  //     });
  //
  //     await userMetricsExist.save();
  //   }
  // }
  //
  // async isAllowedToUseChatGpt(
  //   user: IUser
  // ): Promise<{
  //   daysLeft?: number;
  //   isChatAllowed: boolean;
  // }> {
  //   if (Utils.isAdmin(user)) return { isChatAllowed: true };
  //
  //   const isPartner = user.role === UserRole.PROMOTER;
  //
  //   const isFellow = isPartner ? true : user.customerInfo?.isFellow;
  //   const chatGptTokensPeriodStart = isPartner
  //     ? user.partnerSettings?.chatGptTokensPeriodStart
  //     : user.customerInfo?.chatGptTokensPeriodStart;
  //   const chatGptTokensLeft = isPartner
  //     ? user.partnerSettings?.chatGptTokensLeft
  //     : user.customerInfo?.chatGptTokensLeft;
  //   const resetValues =
  //     !chatGptTokensPeriodStart ||
  //     Utils.isMoreThan30DaysAgo(chatGptTokensPeriodStart);
  //
  //   if (resetValues) {
  //     if (isPartner) {
  //       await this._userRepository.findByIdAndUpdate(user.id, {
  //         ["partnerSettings.chatGptTokensLeft"]: CHAT_GPT_TOKENS_PER_MONTH_FOR_FELLOW,
  //         ["partnerSettings.chatGptTokensPeriodStart"]: new Date(),
  //       });
  //     } else {
  //       await this._userRepository
  //         .findByIdAndUpdate(user.id, {
  //           ["customerInfo.chatGptTokensLeft"]: isFellow
  //             ? CHAT_GPT_TOKENS_PER_MONTH_FOR_FELLOW
  //             : CHAT_GPT_TOKENS_PER_MONTH_FOR_NON_FELLOW,
  //           ["customerInfo.chatGptTokensPeriodStart"]: new Date(),
  //         })
  //         .exec();
  //     }
  //
  //     return { isChatAllowed: true };
  //   } else {
  //     if (chatGptTokensLeft !== undefined && chatGptTokensLeft > 0) {
  //       return { isChatAllowed: true };
  //     } else {
  //       let resetDate = chatGptTokensPeriodStart!;
  //       resetDate.setDate(resetDate.getDate() + 30);
  //       return {
  //         isChatAllowed: false,
  //         daysLeft: Utils.countDifferenceInDays(new Date(), resetDate),
  //       };
  //     }
  //   }
  // }
  //
  // async toggleForumUserBlock(id: string, _actor: IUser): Promise<IUser> {
  //   const user = await this._userRepository
  //     .findOne({
  //       _id: id,
  //       $or: [
  //         {
  //           ["customerInfo.isFellow"]: true,
  //           role: UserRole.CUSTOMER,
  //           isDeleted: false,
  //         },
  //         {
  //           role: UserRole.PROMOTER,
  //           ["partnerSettings.isDeactivated"]: false,
  //         },
  //       ],
  //     })
  //     .exec();
  //
  //   if (!user) {
  //     throw new Error(ErrorCode._404);
  //   }
  //
  //   const partnerUpd: UpdateQuery<IUser> = {
  //     ["partnerSettings.isLockedInForum"]: !Boolean(
  //       user.partnerSettings?.isLockedInForum
  //     ),
  //   };
  //
  //   const userUpd: UpdateQuery<IUser> = {
  //     ["customerInfo.isLockedInForum"]: !Boolean(
  //       user.customerInfo?.isLockedInForum
  //     ),
  //   };
  //
  //   try {
  //     const updatedUser = await this._userRepository.findByIdAndUpdate(
  //       user.id,
  //       user.role === UserRole.PROMOTER ? partnerUpd : userUpd,
  //       {
  //         new: true,
  //       }
  //     );
  //
  //     return updatedUser!;
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
  //
  // async getForumUserById(id: string, _actor: IUser): Promise<IUser> {
  //   const user = await this._userRepository.findOne({
  //     _id: id,
  //     isDeleted: false,
  //     $or: [
  //       {
  //         ["customerInfo.isFellow"]: true,
  //         role: UserRole.CUSTOMER,
  //       },
  //       {
  //         ["partnerSettings.isDeactivated"]: false,
  //         role: UserRole.PROMOTER,
  //       },
  //       {
  //         role: {
  //           $in: [
  //             UserRole.GLOBAL_ADMIN,
  //             UserRole.ADMIN,
  //             UserRole.COACH,
  //             UserRole.MODERATOR,
  //           ],
  //         },
  //       },
  //     ],
  //   });
  //
  //   if (!user) {
  //     throw new Error(ErrorCode._404);
  //   }
  //
  //   return user;
  // }
  //
  // async contactSupport(
  //   input: ContactSupportInput,
  //   actor: IUser
  // ): Promise<void> {
  //   try {
  //     await this._mailService.sendSupportLetter(input, actor);
  //   } catch (error) {
  //     this.log.error(
  //       { input, actor, error },
  //       ".contactSupport(input, actor) thrown error"
  //     );
  //     throw new Error(error);
  //   }
  // }
  //
  async forgotPassword(
    email: IUser["email"],
  ): Promise<boolean> {
    email = email.toLowerCase().trim();
    if (!isEmail(email)) throw new Error(`Invalid email address: ${email}`);

    const userQ: FilterQuery<IUser> = {
      email,
      isDeleted: false,
    };

    const user = await this._userRepository
      .findOne(userQ)
      .exec();

    if (!user) return true;

    try {
      await this._mailService.sendVerificationLink(user, "resetPassword");
      await this._authService.revokeRefreshToken(user);

      return true;
    } catch (error) {
      // this.log.error(
      //   { email, user, error },
      //   "forgotPassword(email) thrown error."
      // );
      throw new Error(error);
    }
  }

  // async updatePassword(
  //   input: UpdatePasswordInput,
  //   actor: IUser
  // ): Promise<IServiceResult<boolean>> {
  //   const { newPassword, oldPassword } = input;
  //
  //   const user = await this.throwIfNotExist(actor.id);
  //
  //   const isValidOldPass = await argon2.verify(
  //     user.hashedPassword,
  //     oldPassword
  //   );
  //
  //   if (!isValidOldPass) {
  //     return {
  //       error: {
  //         name: "general",
  //         message: oldPasswordIsInvalid,
  //       },
  //     };
  //   }
  //
  //   user.set({
  //     updatedBy: actor.id,
  //     hashedPassword: await argon2.hash(newPassword),
  //   });
  //
  //   try {
  //     await user.save();
  //   } catch (err) {
  //     this.log.error({ actor }, ".updatePassword(input, actor) thrown error");
  //     throw new Error(err);
  //   }
  //
  //   return {
  //     object: true,
  //   };
  // }
  //
  // async updateEmail(
  //   email: IUser["email"],
  //   userId: string,
  //   actor: IUser
  // ): Promise<IServiceResult<IUser>> {
  //   const user = await this.throwIfNotExist(userId);
  //
  //   email = email.toLowerCase().trim();
  //   const emailAlreadyExists = await this.returnErrorIfExists(
  //     "email",
  //     email,
  //     true
  //   );
  //   if (emailAlreadyExists) return { error: emailAlreadyExists };
  //
  //   user.set({
  //     email,
  //     emailVerified: false,
  //     updatedBy: actor.id,
  //   });
  //
  //   try {
  //     await user.save();
  //     await this._mailService.sendVerificationLink(user, "signUp");
  //   } catch (err) {
  //     user.remove();
  //     this.log.error(
  //       { email, userId, actor, err },
  //       ".updateEmail(email, userId, actor) thrown error."
  //     );
  //     throw new Error(err);
  //   }
  //
  //   if (!user) throw new Error(`User with id: ${userId} not found!`);
  //
  //   return { object: user };
  // }
  //
  // async updateInfo(input: UpdateUserInfoInput, actor: IUser): Promise<IUser> {
  //   const { userId, countryId, city, applyForPartnership, ...rest } = input;
  //
  //   const user = await this.throwIfNotExist(userId ? userId : actor.id);
  //
  //   let country: ICountry | null = null;
  //   if (countryId) {
  //     country = await this._countryService.getById(countryId);
  //   }
  //
  //   let updateObject: UpdateQuery<IUser> = {
  //     ...rest,
  //     ...(country || city
  //       ? {
  //           location: {
  //             ...(country ? { countryObject: country } : {}),
  //             ...(city ? { city } : {}),
  //           },
  //         }
  //       : {}),
  //   };
  //
  //   if (
  //     applyForPartnership &&
  //     !user.applyForPartnership?.requestForPartnershipSent
  //   ) {
  //     updateObject = {
  //       ...updateObject,
  //       applyForPartnership: {
  //         isApprovedPartner: false,
  //         requestForPartnershipSent: true,
  //       },
  //     };
  //   }
  //
  //   try {
  //     user.set(updateObject);
  //     await user.save();
  //   } catch (error) {
  //     this.log.error(
  //       { input, actor },
  //       ".updateInfo(input, actor) thrown error"
  //     );
  //     throw new Error(error);
  //   }
  //
  //   return user;
  // }
  //
  // async updateSummary(
  //   input: UpdateMySummaryInput,
  //   actor: IUser
  // ): Promise<IUser> {
  //   const { picture, countryId, ...rest } = input;
  //
  //   const user = await this.throwIfNotExist(actor.id);
  //
  //   let avatar: IFileSource | null = null;
  //   if (picture) {
  //     const { publicId, url } = await this._fileService.upload(
  //       picture.source,
  //       "avatars",
  //       user.firstName + " " + user.lastName
  //     );
  //
  //     avatar = {
  //       createdBy: actor.id,
  //       fileName: user.firstName + " " + user.lastName,
  //       public_id: publicId,
  //       type: FileType.IMAGE,
  //       url,
  //     };
  //   }
  //
  //   let country: ICountry | null = null;
  //   if (countryId) {
  //     country = await this._countryService.getById(countryId);
  //   }
  //
  //   const updateObj: UpdateQuery<IUser> = {
  //     ...rest,
  //     ...(avatar ? { avatar } : {}),
  //     ...(countryId
  //       ? {
  //           location: {
  //             ...(country && countryId
  //               ? { countryObject: country }
  //               : countryId
  //               ? { countryObject: undefined }
  //               : {}),
  //           },
  //         }
  //       : {}),
  //     updatedBy: actor.id,
  //   };
  //
  //   try {
  //     user.set(updateObj);
  //     await user.save();
  //   } catch (error) {
  //     this.log.error(
  //       { input, actor },
  //       ".updateSummary(input, actor) thrown error"
  //     );
  //     throw new Error(error);
  //   }
  //
  //   return user;
  // }
  //
  async findUserByVerificationToken(
    token: string,
    action: MailAction
  ): Promise<IErrorResponse | IUser> {
    if (!token) throw new Error("Empty token!");

    const user = await this._userRepository
      .findOne({
        isDeleted: false,
        emailVerificationKey: token,
      })
      .exec();

    if (!user)
      return { name: "invalid" };

    try {
      if (new Date() > user.emailVerificationKeyExpires!) {
        await this._mailService.sendVerificationLink(user, action);
        return { name: "expired" };
      } else {
        return user;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async verifyEmailByToken(token: string): Promise<SuccessErrorResponse> {
    try {
      const res = await this.findUserByVerificationToken(token, "signUp");
      console.log(token)
      if (!Utils.isObject<IUser>(res, "createdBy")) {
        return { success: false, error: res };
      } else {
        const updateObj: UpdateQuery<IUser> = {
          updatedBy: res.id,
          emailVerificationKey: undefined,
          emailVerificationKeyExpires: undefined,
          emailVerified: true,
        };

        res.set(updateObj);

        await res.save();

        const [_, path] = token.split("?redirectTo=");

        return {
          success: true,
          ...(path && { redirectPath: path.split("?")[0] }),
        };
      }
    } catch (error) {
      // this.log.error({ token, error }, ".verifyEmailLink(token) thrown error.");
      throw new Error(error);
    }
  }
  //
  // async setPreferences(
  //   input: SetPreferencesInput,
  //   actor: IUser
  // ): Promise<IUser> {
  //   try {
  //     const user = await this._userRepository
  //       .findByIdAndUpdate(
  //         actor.id,
  //         {
  //           "customerInfo.jobPreference": {
  //             ...input,
  //             regions: input.regions,
  //           },
  //         },
  //         { new: true }
  //       )
  //       .exec();
  //
  //     if (!user) throw new Error(`User with id: ${actor.id} not found!`);
  //
  //     return user;
  //   } catch (err) {
  //     this.log.error(
  //       { input, actor, err },
  //       ".setPreferences(input, actor) thrown error"
  //     );
  //     throw new Error(err);
  //   }
  // }
  //
  // async updateResume(
  //   {
  //     linkedIn,
  //     phone,
  //     ...resume
  //   }: Partial<IUserResume> & { linkedIn?: string; phone?: string },
  //   userId: string
  // ) {
  //   const actor = await this.throwIfNotExist(userId);
  //
  //   const oldValues = actor.resume;
  //
  //   actor.set({
  //     resume: {
  //       ...(oldValues ? { ...oldValues } : {}),
  //       ...resume,
  //     },
  //     ...(linkedIn && {
  //       linkedId: linkedIn,
  //     }),
  //     ...(phone && {
  //       phone,
  //     }),
  //   });
  //
  //   try {
  //     await actor.save();
  //   } catch (error) {
  //     this.log.error(
  //       { resume, actor, error },
  //       ".updateResume(resume, actor) thrown error."
  //     );
  //     throw new Error(error);
  //   }
  // }
  //
  async signUp({
    email,
    password,
    role
  }: SignUpInput): Promise<SuccessErrorResponse> {
    email = email.toLowerCase().trim();

    const emailAlreadyExists = await this.returnErrorIfExists("email", email);
    if (emailAlreadyExists)
      return { success: false, error: emailAlreadyExists };

    const user = new UserModel();

    user.set({
      email,
      hashedPassword: await argon2.hash(password),
      createdBy: user.id,
      emailVerified: false,
      role: role,
      notificationTypes: [NotificationType.EMAIL],
      createdAt: new Date()
    });

    try {
      await user.save();
      await this._mailService.sendVerificationLink(user, "signUp");
    } catch (err) {
      await user.deleteOne();
      // this.log.error(
      //   { email, user, err },
      //   ".signUp(input) thrown error."
      // );
      throw new Error(err);
    }

    return { success: true };
  }

  // async quickSignUp(
  //   {
  //     email,
  //     firstName,
  //     lastName,
  //     password,
  //     regSource,
  //     applyForPartnership,
  //     redirectTo,
  //   }: SignUpInput,
  //   req: Request
  // ): Promise<SignInUserResponse> {
  //   email = email.toLowerCase().trim();
  //
  //   const emailAlreadyExists = await this.returnErrorIfExists("email", email);
  //   if (emailAlreadyExists) return { error: emailAlreadyExists };
  //
  //   const user = new UserModel();
  //
  //   user.set({
  //     email,
  //     hashedPassword: await argon2.hash(password),
  //     firstName,
  //     lastName,
  //     createdBy: user.id,
  //     emailVerified: true,
  //     role: UserRole.CUSTOMER,
  //     notificationTypes: [NotificationType.EMAIL],
  //     customerInfo: {
  //       isFellow: false,
  //       jobPreference: await this._prefService.createDefault(),
  //     },
  //     ...(applyForPartnership && {
  //       partnership: {
  //         isApprovedPartner: false,
  //         requestForPartnershipSent: true,
  //       },
  //     }),
  //   });
  //
  //   try {
  //     await user.save();
  //     await this._logService.addLogEntry(user, req);
  //   } catch (err) {
  //     this.log.error(
  //       { email, firstName, lastName, user, err },
  //       ".quickSignUp(input) thrown error."
  //     );
  //     throw new Error(err);
  //   }
  //
  //   try {
  //     await this._mailService.createMailerSubscriber(user, regSource);
  //   } catch (error) {
  //     this.log.error(
  //       { email, firstName, lastName, error },
  //       ".quickSignUp(input): createMailerSubscriber thrown error."
  //     );
  //   }
  //
  //   return { redirectTo, user };
  // }
  //
  async signInByEmail(
    email: IUser["email"],
    password: string,
    req: Request
  ): Promise<IServiceResult<IUser> & { firstTimeLogin?: boolean }> {
    let user: IUser | null;

    try {
      user = await this._userRepository
        .findOne({
          email: email.toLowerCase().trim(),
          isDeleted: false,
          isLocked: false,
        })
        .exec();
    } catch (error) {
      // this.log.error(
      //   { email, error },
      //   ".signInByEmail(email, password) thrown error."
      // );
      throw new Error(error);
    }

    if (!user) {
      return {
        error: { name: "general", message: invalidLogin },
      };
    }

    if (!user.emailVerified) {
      return {
        error: { name: "general", message: confirmYourEmail },
      };
    }

    const validatePasswords = await argon2.verify(
      user.hashedPassword,
      password
    );

    if (!validatePasswords) {
      return {
        error: { name: "general", message: invalidLogin },
      };
    }

    try {
      const firstTimeLogin = await this._logService.addLogEntry(user, req);

      // this.log.info(
      //   { email, user },
      //   ".signInByEmail(email, password) executed."
      // );

      return {
        object: user,
        firstTimeLogin,
      };
    } catch (error) {
      // this.log.error(
      //   { email, user, error },
      //   ".signInByEmail(email, password) thrown error."
      // );
      throw new Error(error);
    }
  }

  // async signInByUsername(
  //   username: string,
  //   password: string
  // ): Promise<IServiceResult<IUser>> {
  //   let user: IUser | null;
  //
  //   try {
  //     user = await this._userRepository
  //       .findOne({
  //         ["partnerSettings.username"]: username.toLowerCase().trim(),
  //         ["partnerSettings.isDeactivated"]: false,
  //         role: UserRole.PROMOTER,
  //       })
  //       .exec();
  //   } catch (error) {
  //     this.log.error(
  //       { username, error },
  //       ".signInByUsername(username, password) thrown error."
  //     );
  //     throw new Error(error);
  //   }
  //
  //   if (!user) {
  //     return {
  //       error: { name: "general", message: invalidLogin },
  //     };
  //   }
  //
  //   const validatePasswords = await argon2.verify(
  //     user.hashedPassword,
  //     password
  //   );
  //
  //   if (!validatePasswords) {
  //     return {
  //       error: { name: "general", message: invalidLogin },
  //     };
  //   }
  //
  //   try {
  //     this.log.info(
  //       { username },
  //       ".signInByUsername(username, password) executed."
  //     );
  //
  //     return {
  //       object: user,
  //     };
  //   } catch (error) {
  //     this.log.error(
  //       { username, user, error },
  //       ".signInByUsername(email, password) thrown error."
  //     );
  //     throw new Error(error);
  //   }
  // }
  //
  async resetPassword(
    token: string,
    password: string,
    request: Request
  ): Promise<Promise<IServiceResult<IUser> & { firstTimeLogin?: boolean }>> {
    // check if token is valid
    const res = await this.findUserByVerificationToken(token, "resetPassword");
    if (!Utils.isObject<IUser>(res, "createdBy")) {
      return { error: res };
    }

    const updateUserObj: UpdateQuery<IUser> = {
      hashedPassword: await argon2.hash(password),
      emailVerified: true,
      emailVerificationKey: undefined,
      emailVerificationKeyExpires: undefined,
      updatedBy: res.id,
    };
    res.set(updateUserObj);

    // in transaction
    const session = await mongoose.connection.startSession();
    session.startTransaction();
    let firstTimeLogin: boolean;
    try {
      //update user password and email verification key
      await res.save({ session });

      //add entry to logentry
      firstTimeLogin = await this._logService.addLogEntry(
        res,
        request,
        session
      );

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      // this.log.error(
      //   { token, res, error },
      //   ".resetPassword(token, password) thrown error"
      // );
      throw new Error(error);
    } finally {
      res.$session(undefined);
      session.endSession();
    }

    return {
      object: res,
      firstTimeLogin,
    };
  }

  async findOne(query: FilterQuery<IUser>): Promise<IUser | null> {
    return this._userRepository.findOne(query).exec();
  }

  // async throwIfNotExist(
  //   id: IUser["id"],
  //   excludeLocked?: boolean
  // ): Promise<IUser> {
  //   const user = await this._userRepository.findById(id).exec();
  //   if (!user || user.isDeleted || (excludeLocked && user.isLocked)) {
  //     throw new Error(`User with id: ${id} not found!`);
  //   }
  //   return user;
  // }
  //
  async returnErrorIfExists(
    fieldName: "email",
    fieldValue: any,
    includePartner?: boolean
  ): Promise<IErrorResponse | null> {
    switch (fieldName) {
      case "email": {
        const found = await this._userRepository.findOne({
          email: fieldValue,
          ...(!includePartner && {
            role: { $nin: [UserRole.PROMOTER] },
          }),
        });
        return found
          ? {
              name: "email",
              message: emailAlreadyExistsError,
            }
          : null;
      }
      default:
        return null;
    }
  }

  // async deleteUser(id: string): Promise<boolean> {
  //   try {
  //     await this._userRepository.findByIdAndDelete(id).exec();
  //   } catch (error) {
  //     this.log.error({ id, error }, ".deleteUser(id) thrown error");
  //     throw new Error(error);
  //   }
  //   return true;
  // }
}

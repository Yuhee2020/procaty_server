import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { env } from "../../env";
import { ErrorCode, MyContext, UserRole } from "../../lib";
import { IUser } from "../../models";
// import { AuthService, MailService, UserService } from "../../services";
import Utils from "../../utils";
// import {
//   RefreshTokenResponse,
//   SuccessErrorResponse,
//   UserResponse,
// } from "../common";
// import { SignInWithUsernameInput } from "../promoter";
import {
  ContactSupportInput,
  ResetPasswordByTokenInput,
  SendContactInfoInput,
  SetPreferencesInput,
  SignInWithEmailInput,
  SignUpInput,
  SubmitEnquiryInput,
  UpdateMySummaryInput,
  UpdatePasswordInput,
  UpdateUserInfoInput,
} from "./inputs";
import { SignInUserResponse, User_GQL } from "./types";
import {RefreshTokenResponse, SuccessErrorResponse} from "../common";
import {AuthService} from "../../services/authService";
import {UserService} from "../../services/userService";

@Resolver()
@Service()
export class UserResolver {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    // private readonly _mailService: MailService
  ) {}

  // @Mutation(() => User_GQL)
  // @Authorized()
  // async updateUserInfo(
  //   @Arg("input") input: UpdateUserInfoInput,
  //   @Ctx() { payload }: MyContext
  // ): Promise<IUser> {
  //   payload = this.throwIfNoPayload(payload);
  //   if (!Utils.isAdmin(payload) && input.userId) {
  //     throw new Error("Unauthorized!");
  //   }
  //   return this._userService.updateInfo(input, payload);
  // }
  //
  // @Mutation(() => UserResponse)
  // @Authorized()
  // async updateUserEmail(
  //   @Arg("email") email: string,
  //   @Arg("userId") userId: string,
  //   @Ctx() { payload }: MyContext
  // ): Promise<UserResponse> {
  //   payload = this.throwIfNoPayload(payload);
  //
  //   if (
  //     ![UserRole.ADMIN, UserRole.GLOBAL_ADMIN].includes(payload.role) &&
  //     userId !== payload.id
  //   ) {
  //     throw new Error("Unauthorized!");
  //   }
  //
  //   const { error, object: user } = await this._userService.updateEmail(
  //     email,
  //     userId,
  //     payload
  //   );
  //
  //   return error ? { error } : { user };
  // }
  //
  // @Mutation(() => User_GQL)
  // @Authorized()
  // async updateMySummary(
  //   @Arg("input") input: UpdateMySummaryInput,
  //   @Ctx() { payload }: MyContext
  // ): Promise<IUser> {
  //   payload = this.throwIfNoPayload(payload);
  //   return this._userService.updateSummary(input, payload);
  // }
  //
  // // ----- USED -------
  // @Mutation(() => Boolean)
  // async submitEnquiry(
  //   @Arg("input") input: SubmitEnquiryInput
  // ): Promise<boolean> {
  //   await this._mailService.submitEnquiry(input);
  //   return true;
  // }
  //
  // @Mutation(() => Boolean)
  // async sendContactInfo(
  //   @Arg("input") input: SendContactInfoInput
  // ): Promise<boolean> {
  //   await this._mailService.sendContactInfo(input);
  //   return true;
  // }
  //
  //
  // @Mutation(() => Boolean, { nullable: true })
  // @Authorized()
  // async contactSupport(
  //   @Arg("input") input: ContactSupportInput,
  //   @Ctx() { payload }: MyContext
  // ): Promise<void> {
  //   payload = this.throwIfNoPayload(payload);
  //   await this._userService.contactSupport(input, payload);
  // }

  /**
   * Verifies the user email if the given token exists.
   * In case the link has expired, creates a new link and resends the verification message.
   * @param token
   */
  @Mutation(() => SuccessErrorResponse)
  async verifyEmailViaLink(
    @Arg("token") token: string
  ): Promise<SuccessErrorResponse> {
    return this._userService.verifyEmailByToken(token);
  }

  // @Mutation(() => SuccessErrorResponse)
  // @Authorized()
  // async updatePassword(
  //   @Arg("input") input: UpdatePasswordInput,
  //   @Ctx() { payload }: MyContext
  // ): Promise<SuccessErrorResponse> {
  //   payload = this.throwIfNoPayload(payload);
  //
  //   const { error } = await this._userService.updatePassword(input, payload);
  //
  //   return error ? { error, success: false } : { success: true };
  // }

  // @Mutation(() => String)
  // @Authorized()
  // async uploadSingleFile(
  //   @Arg("src") src: string,
  //   @Ctx() { payload }: MyContext
  // ): Promise<string> {
  //   payload = this.throwIfNoPayload(payload);
  //   return this._userService.uploadFile(src, payload);
  // }

  /**
   * Returns the authenticated user entity if any.
   * @param param0
   */
  @Query(() => User_GQL, { nullable: true })
  async me(@Ctx() { req, res }: MyContext): Promise<IUser | null> {
    const user = await this._authService.fetchAuthenticatedUser(req);

    if (!user) return null;

    this._authService.authenticateUser(user, false, res);

    return user;
  }

  /**
   * Verifies if the given email token is valid.
   * @param token
   * @returns
   */
  @Query(() => SuccessErrorResponse)
  async isVerificationTokenValid(
    @Arg("token") token: string
  ): Promise<SuccessErrorResponse> {
    const res = await this._userService.findUserByVerificationToken(
      token,
      "resetPassword"
    );

    return Utils.isObject<IUser>(res, "createdBy")
      ? { success: true }
      : { success: false, error: res };
  }

  /**
   * If the email exists and the user is not soft-deleted or locked, sends a reset link to the email.
   * @param email
   * @returns true
   */
  @Query(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
  ): Promise<boolean> {
    return this._userService.forgotPassword(email);
  }

  /**
   * Authenticates user by email and password.
   * @returns errorResponse or accessToken, user and firstTimeLogin marker.
   */
  @Mutation(() => SignInUserResponse)
  async signInByEmail(
    @Arg("input") { email, password }: SignInWithEmailInput,
    @Ctx() { req, res }: MyContext
  ): Promise<SignInUserResponse> {
    const {
      error,
      object: user,
      firstTimeLogin,
    } = await this._userService.signInByEmail(email, password, req);

    if (!user) return { error };

    return this._authService.authenticateUser(user, firstTimeLogin!, res);
  }

  // @Mutation(() => SignInUserResponse)
  // async signInByUsername(
  //   @Arg("input") { username, password }: SignInWithUsernameInput,
  //   @Ctx() { res }: MyContext
  // ): Promise<SignInUserResponse> {
  //   const { error, object: user } = await this._userService.signInByUsername(
  //     username,
  //     password
  //   );
  //
  //   if (!user) return { error };
  //
  //   return this._authService.authenticateUser(user, false, res);
  // }

  /**
   * Resets the user's password and returns the authenticated user.
   * @param input
   */
  @Mutation(() => SignInUserResponse)
  async resetPasswordByToken(
    @Arg("input") { token, password }: ResetPasswordByTokenInput,
    @Ctx() { req, res }: MyContext
  ): Promise<SignInUserResponse> {
    const {
      error,
      object: user,
      firstTimeLogin,
    } = await this._userService.resetPassword(token, password, req);

    if (!user) return { error };

    return this._authService.authenticateUser(user, firstTimeLogin!, res);
  }

  /**
   * Revokes all refresh tokens from the authenticated user.
   */
  @Mutation(() => Boolean)
  async logout(@Ctx() { res, payload }: MyContext): Promise<boolean> {
    if (payload) {
      try {
        await this._authService.revokeRefreshToken(payload);
      } catch (error) {
        throw new Error(error);
      }

      this._authService.sendRefreshToken("", payload, res);
    }

    res.clearCookie(env.COOKIE_NAME);

    return true;
  }

  /**
   * Registers a new customer user and sends a verification email link.
   * @returns error if email exists else success
   */
  @Mutation(() => SuccessErrorResponse)
  async signUp(
    @Arg("input") input: SignUpInput
  ): Promise<SuccessErrorResponse> {
    return this._userService.signUp(input);
  }

  /**
   * Registers a new customer user and sends a verification email link.
   * @returns error if email exists else success
   */
  // @Mutation(() => SignInUserResponse)
  // async quickSignUp(
  //   @Arg("input") input: SignUpInput,
  //   @Ctx() { req, res }: MyContext
  // ): Promise<SignInUserResponse> {
  //   const { error, redirectTo, user } = await this._userService.quickSignUp(
  //     input,
  //     req
  //   );
  //
  //   if (!user) return { error };
  //
  //   return this._authService.authenticateUser(user, false, res);
  // }

  // private throwIfNoPayload(payload: IUser | undefined): IUser {
  //   if (!payload) {
  //     throw new Error("Unautorized!");
  //   }
  //   return payload;
  // }

  /**
   * Overwrites the authenticated user's preferences with the given input.
   * @param input
   * @param param1
   * @returns
   */
  // @Mutation(() => User_GQL)
  // @Authorized([UserRole.COACH, UserRole.CUSTOMER])
  // async setPreferences(
  //   @Arg("input") input: SetPreferencesInput,
  //   @Ctx() { payload }: MyContext
  // ): Promise<IUser> {
  //   payload = this.throwIfNoPayload(payload);
  //   return this._userService.setPreferences(input, payload);
  // }

  // -------------------------------------

  /**
   * Refreshes the given token if the request has a valid cookie.
   * @param refreshToken
   * @returns
   */
  @Query(() => RefreshTokenResponse)
  async refreshToken(
    @Ctx() { req, res }: MyContext
  ): Promise<RefreshTokenResponse> {
    return this._authService.refreshToken(req, res);
  }
  //
  // @Mutation(() => Boolean)
  // @Authorized(Utils.admins())
  // async completelyRemoveUser(
  //   @Arg("id") id: string,
  //   @Ctx() { payload }: MyContext
  // ): Promise<boolean> {
  //   this.throwIfNoPayload(payload);
  //   return this._userService.deleteUser(id);
  // }
}

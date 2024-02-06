import Logger from "bunyan";
import { Inject, Service } from "typedi";
import { env } from "../../env";
import {
  ContactSupportInput,
  SubmitEnquiryInput,
  SendContactInfoInput,
} from "../../graphql/user/inputs";
import { createUHLogger } from "../../helpers";
import {
  MailAction,
} from "../../lib";
import {
  IUser,
  IUserModel,
} from "../../models";
import Utils from "../../utils";
import {PostmarkProvider} from "../../providers/postmarkProvider";
import { v4 as uuidv4 } from 'uuid'

@Service()
export class MailService {
  constructor(@Inject("USER") private readonly _userRepository: IUserModel) {}

  @Inject(() => PostmarkProvider)
  private readonly _postmarkProvider: PostmarkProvider;

  protected readonly log: Logger = createUHLogger({ name: "mailService" });

  // async notifyOnError(error: string, subject: string) {
  //   try {
  //     await this._postmarkProvider.sendError(error, subject);
  //   } catch (err) {
  //     this.log.error({ err }, ".notifyOnError(error) thrown error");
  //   }
  // }
  //
  // async submitEnquiry(input: SubmitEnquiryInput): Promise<void> {
  //   await this._postmarkProvider.sendEnquiry(input);
  // }

  // async sendSupportLetter(
  //   input: ContactSupportInput,
  //   actor: IUser
  // ): Promise<void> {
  //   await this._postmarkProvider.sendSupportTemplate(input, actor);
  // }

  async sendVerificationLink(
    user: IUser,
    action: MailAction,
    redirectTo?: string
  ): Promise<void> {
    try {
      let link;
      let subject;
      switch (action) {
        case "signUp":
          link = await this.createVerificationLink(
            user,
            "verification",
            redirectTo
          );
          console.log(link)
          await this._postmarkProvider.sendSignupTemplate({
            link,
            user,
          });
          break;
        case "resetPassword":
          link = await this.createVerificationLink(user, "reset-password");
          await this._postmarkProvider.sendResetPasswordTemplate({
            link,
            user,
          });
          break;
        // case "registrationByAdmin":
        //   link = await this.createVerificationLink(user, "reset-password");
        //   await this._postmarkProvider.sendRegistrationByAdmin({
        //     link,
        //     user,
        //   });
        //   break;
        default:
          subject = "Unknown";
          break;
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  private async createVerificationLink(
    user: IUser,
    path: string,
    redirectTo?: string
  ): Promise<string> {
    let emailVerificationKey = uuidv4();
    const now = new Date();
    console.log(emailVerificationKey)
    if (redirectTo) {
      emailVerificationKey = `${emailVerificationKey}?redirectTo=${encodeURI(
        redirectTo
      )}`;
    }

    try {
      await user.updateOne({
        emailVerificationKey,
        emailVerificationKeyExpires: new Date(
          now.setSeconds(now.getSeconds() + 60 * 60 * 24)
        ),
        updatedBy: user.id,
      });
    } catch (error) {
      throw new Error(error);
    }

    if (Utils.isAdmin(user)) {
      return env.NODE_ENV === "development"
        ? `${env.FRONT_ADMIN_LOCAL_URL}/${path}/${emailVerificationKey}`
        : `${env.FRONT_ADMIN_URL}/${path}/${emailVerificationKey}`;
    } else {
      return env.NODE_ENV === "development"
        ? `${env.FRONT_LOCAL_URL}/${path}/${emailVerificationKey}`
        : `${env.FRONT_URL}/${path}/${emailVerificationKey}`;
    }
  }

  // async sendContactInfo(input: SendContactInfoInput): Promise<void> {
  //   await this._postmarkProvider.sendContactInfo(input);
  // }

}

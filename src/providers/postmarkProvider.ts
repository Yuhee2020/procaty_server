import { Service } from "typedi";
import postmarkTypes from "postmark";
import Logger from "bunyan";
import {
  NO_REPLY_EMAIL,
  PROCATY_COMPANY_ADDRESS,
  PROCATY_COMPANY_NAME,
  PROCATY_TELEGRAM,
  SUPPORT_EMAIL
} from "../lib";
import {env} from "../env";
import {createUHLogger} from "../helpers";
import {IUser} from "../models";
import {
  ContactSupportInput,
  SendContactInfoInput,
  SubmitEnquiryInput
} from "../graphql/user/inputs";

let postmark = require("postmark");

const TemplateModelProps: postmarkTypes.TemplatedMessage["TemplateModel"] = {
  product_name: "Procaty.by",
  telegram: PROCATY_TELEGRAM,
  company_name: PROCATY_COMPANY_NAME,
  company_address: PROCATY_COMPANY_ADDRESS,
  support_email: SUPPORT_EMAIL,
};

@Service()
export class PostmarkProvider {
  private readonly _postmark: postmarkTypes.Client;

  constructor() {
    this._postmark = new postmark.ServerClient(env.POSTMARK_API_KEY);
  }

  // @Inject(() => JobService)
  // private readonly _jobService: JobService;

  // protected readonly log: Logger = createUHLogger({ name: "postmarkProvider" });

  async sendResetPasswordTemplate({
    link,
    user,
  }: {
    link: string;
    user: IUser;
  }) {
    const data: postmarkTypes.TemplatedMessage = {
      From: NO_REPLY_EMAIL,
      To: user.email,
      TemplateId: 34436848,
      TemplateModel: {
        ...TemplateModelProps,
        name: user.firstName,
        action_url: link,
      },
    };

    try {
      await this._postmark.sendEmailWithTemplate(data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // async sendEnquiry({
  //   email,
  //   message,
  //   name,
  //   subject,
  // }: SubmitEnquiryInput): Promise<void> {
  //   let htmlText = "<h3>New enquiry</h3>";
  //   htmlText += `<p>Subject: ${subject}</p>`;
  //   htmlText += `<p>User Name: ${name}</p>`;
  //   htmlText += `<p>User Email: ${email}</p>`;
  //   htmlText += `<p>Message:</p><br /><p> ${message}</p>`;
  //
  //   const data: postmarkTypes.Message = {
  //     From: "noreply@networkio.io",
  //     To: "support@networkio.io ",
  //     Subject: `New enquiry from Networkio Form Submission: ${subject}`,
  //     HtmlBody: htmlText,
  //   };
  //
  //   try {
  //     await this._postmark.sendEmail(data);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  // async sendSupportTemplate(
  //   input: ContactSupportInput,
  //   actor: IUser
  // ): Promise<void> {
  //   let htmlText = "<h3>New support message</h3>";
  //   htmlText += `<p>User ID: ${actor.id}</p>`;
  //   htmlText += `<p>User Name: ${actor.firstName}</p>`;
  //   htmlText += `<p>User Email: ${actor.email}</p>`;
  //   htmlText += `<p>User Role: ${actor.role}</p>`;
  //   htmlText += `<p>Message: ${input.message}</p>`;
  //
  //   const data: postmarkTypes.Message = {
  //     From: "noreply@networkio.io",
  //     To: "support@networkio.io ",
  //     Subject: `${actor.firstName} : ${input.title}`,
  //     HtmlBody: htmlText,
  //   };
  //
  //   try {
  //     await this._postmark.sendEmail(data);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  // async sendRegistrationByAdmin({ link, user }: { link: string; user: IUser }) {
  //   const data: postmarkTypes.TemplatedMessage = {
  //     From: "noreply@networkio.io",
  //     To: user.email,
  //     TemplateId: 32739705,
  //     TemplateModel: {
  //       ...TemplateModelProps,
  //       name: user.firstName,
  //       action_url: link,
  //     },
  //   };
  //
  //   try {
  //     await this._postmark.sendEmailWithTemplate(data);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  // async sendError(error: string, subject: string) {
  //   const data: postmarkTypes.Message = {
  //     From: "noreply@networkio.io",
  //     To: env.GLOBAL_ADMIN_EMAIL,
  //     Subject: subject,
  //     HtmlBody: error,
  //   };
  //
  //   try {
  //     await this._postmark.sendEmail(data);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  async sendSignupTemplate({ link, user }: { link: string; user: IUser }) {
    const data: postmarkTypes.TemplatedMessage = {
      From: NO_REPLY_EMAIL,
      To: user.email,
      TemplateId: 34436980,
      TemplateModel: {
        ...TemplateModelProps,
        name: user.firstName,
        action_url: link,
      },
    };

    try {
      await this._postmark.sendEmailWithTemplate(data);
    } catch (error) {
      throw new Error(error);
    }
  }

  // async sendContactInfo({
  //   email,
  //   message,
  //   telegram,
  //   name,
  //   subject,
  // }: SendContactInfoInput): Promise<void> {
  //   let htmlText = "<h3>New request</h3>";
  //   htmlText += `<p>Subject: ${subject}</p>`;
  //   htmlText += `<p>User Name: ${name}</p>`;
  //   htmlText += `<p>User Email: ${email}</p>`;
  //   htmlText += `<p>User Telegram: ${telegram}</p>`;
  //   htmlText += `<p>Message:</p><br /><p> ${message}</p>`;
  //
  //   const data: postmarkTypes.Message = {
  //     From: "noreply@networkio.io",
  //     To: "support@networkio.io ",
  //     Subject: `New request from Networkio Network Form : ${subject}`,
  //     HtmlBody: htmlText,
  //   };
  //
  //   try {
  //     await this._postmark.sendEmail(data);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
}

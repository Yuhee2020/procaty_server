import { cleanEnv, port, str, ValidatorSpec } from "envalid";
import path from "path";
require("dotenv").config({
  path: __dirname.includes("htdocs")
    ? path.resolve(__dirname + "/../../.env")
    : path.resolve(__dirname + "/../.env"),
});

export type Environments = "production" | "development";
export type Env = Readonly<{
  isDev: boolean;
  MAILER_LITE_API_KEY: string;
  isProd: boolean;
  NODE_ENV: Environments;
  PORT: number;
  LOGS_PATH: string;
  LOG_LEVEL: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_CLUSTER: string;
  DB_BASE_URL: string;
  DB_NAME: string;
  GLOBAL_ADMIN_PASSWORD: string;
  GLOBAL_ADMIN_EMAIL: string;
  GLOBAL_ADMIN_FNAME: string;
  GLOBAL_ADMIN_LNAME: string;
  FRONT_LOCAL_URL: string;
  FRONT_FBASE_URL: string;
  FRONT_ADMIN_LOCAL_URL: string;
  FRONT_ADMIN_FBASE_URL: string;
  FRONT_URL: string;
  FRONT_ADMIN_URL: string;
  REFRESH_TOKEN_SECRET: string;
  COOKIE_NAME: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  MGUN_KEY: string;
  MGUN_DOMAIN: string;
  FAKE_USER_PASSWORD: string;
  CLOUDINARY_KEY: string;
  CLOUDINARY_SECRET: string;
  CLOUDINARY_NAME: string;
  PROXYCURL_KEY: string;
  PROXYCURL_API_ENDPOINT: string;
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  PAYPAL_WEBHOOK_ID: string;
  PAYPAL_API: string;
  PAYPAL_AUTH_API: string;
  YOO_SECRET: string;
  YOO_ID: string;
  STRIPE_SECRET: string;
  STRIPE_HOOK_SECRET: string;
  OPENAI_API_KEY: string;
  FRONT_WWW_URL: string;
  FRONT_STAGING_URL: string;
  EXCHANGE_RATES_API_KEY: string;
  POSTMARK_API_KEY: string;
  COOKIE_DOMAIN: string;
}>;
export const env: Env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["production", "development"],
    default: "development",
  }) as ValidatorSpec<Env["NODE_ENV"]>,
  PORT: port({ default: 5555 }),
  LOGS_PATH: str({ default: "./tmp/logs" }),
  LOG_LEVEL: str({
    choices: ["trace", "debug", "info", "warn", "error", "fatal"],
    default: "debug",
  }),
  DB_USER: str({ default: "" }),
  DB_PASSWORD: str({ default: "" }),
  DB_CLUSTER: str({ default: "" }),
  MAILER_LITE_API_KEY: str({ default: "" }),
  POSTMARK_API_KEY: str({ default: "" }),
  DB_NAME: str({ default: "" }),
  DB_BASE_URL: str({
    default: "",
  }),
  GLOBAL_ADMIN_PASSWORD: str({ default: "" }),
  GLOBAL_ADMIN_EMAIL: str({ default: "" }),
  GLOBAL_ADMIN_FNAME: str({ default: "Dmitry" }),
  GLOBAL_ADMIN_LNAME: str({ default: "Yuhimuk" }),
  FRONT_LOCAL_URL: str({ default: "http://localhost:3000/" }),
  FRONT_FBASE_URL: str({ default: "" }), //TODO: change to fb link
  FRONT_ADMIN_LOCAL_URL: str({ default: "http://localhost:4000/" }),
  FRONT_ADMIN_FBASE_URL: str({ default: "" }), //TODO: change to fb link
  FRONT_URL: str({ default: "https://prokaty.vercel.app/" }),
  // FRONT_URL: str({ default: "" }),
  FRONT_WWW_URL: str({ default: "https://prokaty.vercel.app/" }),
  // FRONT_WWW_URL: str({ default: "" }),
  FRONT_STAGING_URL: str({
    default: "https://prokaty.vercel.app/",
  }),
  // FRONT_STAGING_URL: str({
  //   default: "",
  // }),
  FRONT_ADMIN_URL: str({ default: "https://prokaty.vercel.app/" }),
  // FRONT_ADMIN_URL: str({ default: "" }),
  REFRESH_TOKEN_SECRET: str({ default: "default_refresh_secret" }),
  COOKIE_NAME: str({ default: "__pbid__" }),
  COOKIE_DOMAIN: str({ default: ".procaty.by" }),
  ACCESS_TOKEN_SECRET: str({ default: "default_access_secret" }),
  REFRESH_TOKEN_EXPIRES_IN: str({ default: "7d" }),
  ACCESS_TOKEN_EXPIRES_IN: str({ default: "1d" }),
  MGUN_KEY: str({ default: "" }),
  // MGUN_DOMAIN: str({ default: "networkio.io" }),
  MGUN_DOMAIN: str({ default: "" }),
  FAKE_USER_PASSWORD: str({ default: "Password123" }),
  PROXYCURL_KEY: str({ default: "" }),
  PROXYCURL_API_ENDPOINT: str({
    default: "https://nubela.co/proxycurl/api/linkedin/job",
  }),
  CLOUDINARY_KEY: str({ default: "" }),
  CLOUDINARY_SECRET: str({ default: "" }),
  CLOUDINARY_NAME: str({ default: "" }),
  OPENAI_API_KEY: str({
    default: "",
  }),

  PAYPAL_CLIENT_ID: str({ default: "" }),
  PAYPAL_CLIENT_SECRET: str({ default: "" }),
  PAYPAL_WEBHOOK_ID: str({ default: "" }),
  PAYPAL_API: str({ default: "" }),
  PAYPAL_AUTH_API: str({ default: "" }),
  YOO_SECRET: str({ default: "" }),
  YOO_ID: str({ default: "" }),
  STRIPE_SECRET: str({ default: "" }),
  STRIPE_HOOK_SECRET: str({ default: "" }),

  EXCHANGE_RATES_API_KEY: str({ default: "" }),
});

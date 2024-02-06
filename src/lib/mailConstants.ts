import path from "path";
import { env } from "../env";

//Subjects
export const signUpEmailVerificationSubject =
  "Регистрация в Networkio: подвердите свой адрес электронной почты";

export const resetPasswordSubject = "Ссылка для сброса пароля Networkio";

export const jobImportIsCompletedSubject = "Импорт вакансий Networkio завершен";

export const digestVerificationSubject =
  "Еженедельный дайджест вакансий от Networkio";

export const weeklyDigestError = "Weekly Digest thrown error";

//Image paths
export const logoPath =
  env.NODE_ENV === "development"
    ? path.join(__dirname, "/../../src/assets/logo-new.svg")
    : path.join(__dirname, "/../../assets/logo-new.svg");
export const calendar =
  env.NODE_ENV === "development"
    ? path.join(__dirname, "/../../src/assets/calendar.svg")
    : path.join(__dirname, "/../../assets/calendar.svg");
export const view =
  env.NODE_ENV === "development"
    ? path.join(__dirname, "/../../src/assets/view.svg")
    : path.join(__dirname, "/../../assets/view.svg");
export const fbPath =
  env.NODE_ENV === "development"
    ? path.join(__dirname, "/../../src/assets/facebook.svg")
    : path.join(__dirname, "/../../assets/facebook.svg");
export const telegramPath =
  env.NODE_ENV === "development"
    ? path.join(__dirname, "/../../src/assets/telegram.svg")
    : path.join(__dirname, "/../../assets/telegram.svg");
export const instaPath =
  env.NODE_ENV === "development"
    ? path.join(__dirname, "/../../src/assets/instagram.svg")
    : path.join(__dirname, "/../../assets/instagram.svg");
export const vkPath =
  env.NODE_ENV === "development"
    ? path.join(__dirname, "/../../src/assets/vk.svg")
    : path.join(__dirname, "/../../assets/vk.svg");

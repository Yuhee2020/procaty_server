import { UserRole } from "../enums";

export namespace Translations {
  export const userRoles = {
    [UserRole.ADMIN]: "Администратор",
    [UserRole.GLOBAL_ADMIN]: "Глобальный администратор",
    [UserRole.CUSTOMER]: "Клиент",
    [UserRole.MODERATOR]: "Модератор",
    [UserRole.PROMOTER]: "Партнер",
  };
}

import { Request } from "express";
import { ReadAccess, UserRole } from "../lib";
import { IUser } from "../models";

namespace Utils {
  export function getRandomElementFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  export function getMaxDate(date1: Date, date2: Date): Date {
    return new Date(Math.max(date1.getTime(), date2.getTime()));
  }

  export function roundWithDecimals(
    input: number,
    decimalsCount: number
  ): number {
    const decCoeff = Math.pow(10, decimalsCount);
    return Math.round(input * decCoeff) / decCoeff;
  }

  export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
    const copy = {} as Pick<T, K>;

    keys.forEach((key) => (copy[key] = obj[key]));

    return copy;
  }

  export function interfaceKeys<T>(keys: Record<keyof T, 1>) {
    return Object.keys(keys) as Array<keyof T>;
  }

  /**
   * Returns a random integer between min and max included.
   * @param min lower boundary
   * @param max upper boundary
   */
  export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Returns a random boolean value.
   */
  export function getRandomBoolean(): boolean {
    return Math.random() < 0.5;
  }

  /**
   * Returns an array with unique random elements from the source array.
   * @param source array of strings
   * @returns
   */
  export function getRandomArrayElements(source: string[]): string[] {
    const length = getRandomInt(1, source.length);
    const res: string[] = [];

    for (let i = 0; i < length; i++) {
      let randomIndex = getRandomInt(0, source.length - 1);
      while (res.includes(source[randomIndex])) {
        randomIndex = getRandomInt(0, source.length - 1);
      }
      res[i] = source[randomIndex];
    }

    return res;
  }

  /**
   * Checks if the first array if a subset of the second array.
   * An empty array is considered to be a subset of any array.
   * Expects only unique values in both parametes.
   * @returns
   */
  export function isSubset(child: string[], parent: string[]): boolean {
    if (!child.length) return true;

    return !child.some((el) => !parent.includes(el));
  }

  /**
   * Returns read access type based on the user entity
   * @param actor
   * @returns
   */
  export function readAccessFor(actor?: IUser): ReadAccess[] {
    if (!actor) return [ReadAccess.UNANYMOUS];

    if (
      isAdmin(actor) ||
      actor.role === UserRole.PROMOTER
      // || actor.customerInfo?.isFellow
    )
      return [ReadAccess.AUTHORIZED, ReadAccess.FELLOW, ReadAccess.UNANYMOUS];

    return [ReadAccess.UNANYMOUS, ReadAccess.AUTHORIZED];
  }

  /**
   * Converts a given enum to an array of the enum values
   * @param input Enum
   */
  export function convertEnumToArray<T>(input: T): T[keyof T][] {
    let arrayWithEnumItems: T[keyof T][] = [];
    for (let item in input) {
      if (isNaN(Number(item))) {
        arrayWithEnumItems.push(input[item]);
      }
    }
    return arrayWithEnumItems;
  }

  /**
   * Returns array of admin user roles.
   * @returns
   */
  export function admins(includeModerators: boolean = true) {
    return includeModerators
      ? [UserRole.MODERATOR, UserRole.ADMIN, UserRole.GLOBAL_ADMIN]
      : [UserRole.ADMIN, UserRole.GLOBAL_ADMIN];
  }

  /**
   * Return [proxied] IP address
   * @param req Request object
   * @returns
   */
  export function getIPAddressFromRequest(req: Request): string | undefined {
    let headers = req.headers["x-forwarded-for"];
    if (headers) {
      return (headers as string).split(",").shift();
    } else {
      return req.socket?.remoteAddress;
    }
  }

  /**
   * Determines whether the given user belongs to administration
   * @param user
   * @returns boolean
   */
  export function isAdmin(user: IUser): boolean {
    return [UserRole.ADMIN, UserRole.GLOBAL_ADMIN, UserRole.MODERATOR].includes(
      user.role
    );
  }

  /**
   * Checks if the given instance is of a certain type.
   * @param input
   * @param key
   */
  export function isObject<T>(input: T | any, key: keyof T): input is T {
    return (input as T)[key] !== undefined;
  }

  /**
   * Checks if the string is a valid Date
   */
  export function isValidDate(date: any) {
    return date instanceof Date && !isNaN(date.valueOf());
  }

  /**
   * Removes the requested parameter from the URL if it exists, if it doesnt the url will not change.
   * @param url
   * @param parameter
   * @returns
   */
  export function removeURLParameter(url: string, parameter: string) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split("?");
    if (urlparts.length >= 2) {
      var prefix = encodeURIComponent(parameter) + "=";
      var pars = urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (var i = pars.length; i-- > 0; ) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
    }
    /* TODO : Fix this code - the split does not work properly, this should handle additional cases where there are %26 delimiters.
    if (urlparts.length >= 2) {
      var prefix = encodeURIComponent(parameter) + "=";
      var pars = urlparts[1].split(/[%26;]/g);
  
      //reverse iteration as may be destructive
      for (var i = pars.length; i-- > 0; ) {
        //idiom for string.startsWith
        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }
  
      return urlparts[0] + (pars.length > 0 ? "?" + pars.join("%26") : "");
    }*/
    return url;
  }

  export function isSameDate(date1: Date, date2: Date): boolean {
    const date1Day = date1.getDate();
    const date1Month = date1.getMonth();
    const date1Year = date1.getFullYear();

    const date2Day = date2.getDate();
    const date2Month = date2.getMonth();
    const date2Year = date2.getFullYear();

    return (
      date1Day === date2Day &&
      date1Month === date2Month &&
      date1Year === date2Year
    );
  }

  export function isMoreThan30DaysAgo(date: Date): boolean {
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const timestampThirtyDaysAgo = new Date().getTime() - thirtyDaysInMs;

    if (timestampThirtyDaysAgo > date.getTime()) {
      return true;
    } else {
      return false;
    }
  }

  export function countDifferenceInDays(date1: Date, date2: Date): number {
    var t2 = date2.getTime();
    var t1 = date1.getTime();

    return Math.floor((t2 - t1) / (24 * 3600 * 1000));
  }

  export function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export default Utils;

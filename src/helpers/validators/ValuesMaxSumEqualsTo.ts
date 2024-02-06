import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export function ValuesMaxSumEqualsTo(
  secondValue: string,
  maxSum: number,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "ValuesMaxSumEqualsTo",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [secondValue, maxSum],
      options: validationOptions,
      validator: {
        validate(value: number, args: ValidationArguments) {
          const [secondValue, maxSum] = args.constraints;
          const targetObj = args.object.valueOf() as any;
          return targetObj[secondValue] + value <= maxSum;
        },
      },
    });
  };
}

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isIn,
  buildMessage,
} from "class-validator";

export function IsInLowerCase(
  values: string[],
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "IsInLowerCase",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [values],
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return isIn(
            value.toLowerCase(),
            args.constraints[0].map((v: any) => v.toLowerCase())
          );
        },

        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix +
            "$property must be one of the following values: $constraint1",
          validationOptions
        ),
      },
    });
  };
}

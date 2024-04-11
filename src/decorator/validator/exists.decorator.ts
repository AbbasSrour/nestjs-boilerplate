// TODO: Fix this validator
// import {
//   registerDecorator,
//   type ValidationArguments,
//   type ValidationOptions,
//   ValidatorConstraint,
//   type ValidatorConstraintInterface,
// } from 'class-validator';
// import { DataSource } from 'typeorm';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { MikroORM } from '@mikro-orm/core';
//
// import { type EntitySchema, type FindOptions } from '@mikro-orm/core';
// import { EntityManager } from '@mikro-orm/postgresql';
//
// type ExistsValidationConstraints<E> = [
//   EntitySchema<E> | string,
//   (validationArguments: ValidationArguments) => FindOptions<E>,
// ];
//
// interface IExistsValidationArguments<E> extends ValidationArguments {
//   constraints: ExistsValidationConstraints<E>;
// }
//
// /**
//  * @deprecated Don't use this validator until it's fixed in NestJS
//  */
// @ValidatorConstraint({ name: 'exists', async: true })
// export class ExistsValidator implements ValidatorConstraintInterface {
//   constructor(
//     @InjectDataSource() private readonly dataSource: DataSource,
//     private readonly orm: MikroORM,
//     private readonly em: EntityManager,
//   ) {}
//
//   public async validate<E>(
//     _value: string,
//     args: IExistsValidationArguments<E>,
//   ): Promise<boolean> {
//     const [entityClass, findCondition] = args.constraints;
//
//     return (
//       (await this.em.getRepository(entityClass).count({
//         where: findCondition(args),
//       })) > 0
//     );
//   }
//
//   defaultMessage(args: ValidationArguments): string {
//     const [entityClass] = args.constraints;
//     const entity = entityClass.name ?? 'Entity';
//
//     return `The selected ${args.property}  does not exist in ${entity} entity`;
//   }
// }
//
// export function Exists<E>(
//   constraints: Partial<ExistsValidationConstraints<E>>,
//   validationOptions?: ValidationOptions,
// ): PropertyDecorator {
//   return (object, propertyName: string | symbol) =>
//     registerDecorator({
//       target: object.constructor,
//       propertyName: propertyName as string,
//       options: validationOptions,
//       constraints,
//       validator: ExistsValidator,
//     });
// }

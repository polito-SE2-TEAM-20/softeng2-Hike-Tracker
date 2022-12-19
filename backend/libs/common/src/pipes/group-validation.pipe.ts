import {
  ArgumentMetadata,
  PipeTransform,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

export class GroupValidationPipe implements PipeTransform {
  constructor(private readonly options?: ValidationPipeOptions) {}

  transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const { metatype } = metadata;

    if (!metatype) {
      throw new Error('metatype is required');
    }

    const instance = plainToInstance(metatype, value);

    if (!instance) {
      return value;
    }

    let groups: string[] = [];
    if (typeof instance.generateGroups === 'function') {
      groups = instance.generateGroups();
    }

    const validationPipe = new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      ...this.options,
      groups,
    });

    return validationPipe.transform(value, metadata);
  }
}

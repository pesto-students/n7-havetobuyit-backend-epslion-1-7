import { PipeTransform, Injectable } from '@nestjs/common';
import aqp from 'api-query-params';
import { Types } from 'mongoose';
import { ParsedQuery } from '../../interfaces/jsonapi';

@Injectable()
export class JsonApiQueryParser implements PipeTransform {
  transform(value: any): ParsedQuery {
    return aqp(value, {
      projectionKey: 'select',
      populationKey: 'include',
      casters: {
        ObjectId: val => new Types.ObjectId(val),
      },
    });
  }
}

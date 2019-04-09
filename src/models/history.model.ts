import {Entity, model, property} from '@loopback/repository';

@model()
export class History extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  ID: number;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
  })
  type?: string;


  constructor(data?: Partial<History>) {
    super(data);
  }
}

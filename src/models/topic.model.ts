import {Entity, model, property} from '@loopback/repository';

@model()
export class Topic extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'date',
    required: true,
  })
  creation_date: string;


  constructor(data?: Partial<Topic>) {
    super(data);
  }
}

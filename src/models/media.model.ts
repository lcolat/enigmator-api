import {Entity, model, property} from '@loopback/repository';

@model()
export class Media extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  Type: string;

  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  path: string;


  constructor(data?: Partial<Media>) {
    super(data);
  }
}

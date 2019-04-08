import {Entity, model, property} from '@loopback/repository';

@model()
export class Enigme extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  Question?: string;

  @property({
    type: 'string',
    required: true,
  })
  Reponse: string;

  @property({
    type: 'boolean',
    required: true,
  })
  Etats: boolean;


  constructor(data?: Partial<Enigme>) {
    super(data);
  }
}

import { Request } from 'express';

export interface IRequestWithTrace extends Request {
  traceId: string;
}

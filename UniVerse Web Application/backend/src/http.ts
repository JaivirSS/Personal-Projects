import { Request, Response } from "express";
export enum HTTPStatus {
  StatusOk = 200,
  NotFound = 404,
  UnAuthorised = 401,
  BadRequest = 400,
  InternalServerError = 500,
  Conflict = 409,
}

export interface AuthRequest extends Request {
  userId: number;
}

interface errorPayload {
  error: string;
}

export class HTTPResponse {
  private response: any;
  private statusCode: HTTPStatus;
  constructor(response: any, statusCode: number) {
    this.statusCode = statusCode;
    this.response = response;
  }
  public getStatusCode(): number {
    return this.statusCode;
  }
  public getResponse(): any {
    return this.response;
  }
}

export function newErrorPayload(message: string): errorPayload {
  return { error: message };
}

export type AsyncHandler = (
  req: Request,
) => Promise<HTTPResponse> | HTTPResponse;

export async function httpHandler(
  req: Request,
  res: Response,
  handler: AsyncHandler,
) {
  let httpResponse = await handler(req);
  res.status(httpResponse.getStatusCode()).json(httpResponse.getResponse());
}

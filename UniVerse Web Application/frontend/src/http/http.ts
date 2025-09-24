export class HTTPResponse {
  private message: string;
  private code: number;
  constructor(message: string, code: number) {
    this.message = message;
    this.code = code;
  }

  getMessage(): string {
    return this.message;
  }
  getCode(): number {
    return this.code;
  }
}

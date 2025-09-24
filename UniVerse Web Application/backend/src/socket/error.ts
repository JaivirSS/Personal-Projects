export class SocketError {
  private response: any;
  constructor(response: any) {
    this.response = response;
  }
  public getResponse(): any {
    return this.response;
  }
}

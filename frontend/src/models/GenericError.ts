export class GenericError {
  err: string;
  desc: string | unknown;

  constructor(err: string = "", desc: string = "") {
    this.err = err;
    this.desc = desc;
  }

  public static New() {
    return new GenericError();
  }

  public SetErr(err: string) {
    this.err = err;
    return this;
  }

  public SetDesc(desc: string | unknown) {
    this.desc = desc;
    return this;
  }
}

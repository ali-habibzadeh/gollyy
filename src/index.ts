import { join } from "path";

export default class Foo {
  constructor(private num: number) {}

  public foo(): string {
    return join(__dirname, this.num.toString());
  }
}

import { Argument } from '../Argument.js';

export abstract class ArgumentFactory {
    static fromArg(arg: string): Argument {
        return new Argument(arg);
    }
}

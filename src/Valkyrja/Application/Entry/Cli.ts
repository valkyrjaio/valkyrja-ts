/*
 * This file is part of the Valkyrja Framework package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { App } from './Abstract/App.ts';
import { InputFactory } from '../../Cli/Interaction/Input/Factory/InputFactory.ts';
import { CliServerServiceId } from '../../Cli/Server/Constant/CliServerServiceId.ts';

import type { CliConfigContract } from '../Data/Contract/CliConfigContract.ts';
import type { InputContract } from '../../Cli/Interaction/Input/Contract/InputContract.ts';
import type { InputHandlerContract } from '../../Cli/Server/Handler/Contract/InputHandlerContract.ts';

export class Cli extends App {
    static run(config: CliConfigContract): void {
        const app = this.start(config);
        const container = app.getContainer();

        this.bootstrapThrowableHandler(app, container);

        const handler = container.getSingleton<InputHandlerContract>(CliServerServiceId.InputHandlerContract);
        const input = this.getInput(config);

        handler.run(input);
    }

    static getInput(config: CliConfigContract): InputContract {
        // process.argv leads with the interpreter path, so drop it: the factory expects the vector
        // to start with the caller, followed by the command name and the rest of the args.
        return InputFactory.fromGlobals(process.argv.slice(1), config.applicationName, config.defaultCommandName);
    }
}

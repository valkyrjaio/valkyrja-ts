import { App } from './Abstract/App.js';
import { InputFactory } from '../../Cli/Interaction/Input/Factory/InputFactory.js';
import { CliServerServiceId } from '../../Cli/Server/Constant/CliServerServiceId.js';

import type { CliConfigContract } from '../Data/Contract/CliConfigContract.js';
import type { InputContract } from '../../Cli/Interaction/Input/Contract/InputContract.js';
import type { InputHandlerContract } from '../../Cli/Server/Handler/Contract/InputHandlerContract.js';

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
        return InputFactory.fromGlobals(process.argv, config.applicationName, config.defaultCommandName);
    }
}

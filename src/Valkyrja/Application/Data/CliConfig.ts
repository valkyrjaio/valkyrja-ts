/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ApplicationInfo } from '../Constant/ApplicationInfo.ts';
import { ApplicationServiceId } from '../Constant/ApplicationServiceId.ts';
import { CliWithHttpApplicationComponentProvider } from '../Provider/CliWithHttpApplicationComponentProvider.ts';
import { CliServerServiceId } from '../../Cli/Server/Constant/CliServerServiceId.ts';
import { CliCommandName } from '../../Cli/Server/Constant/CommandName.ts';

import type { ApplicationContract } from '../Kernel/Contract/ApplicationContract.ts';
import type { ComponentProviderContract } from '../Provider/Contract/ComponentProviderContract.ts';
import type { CliConfigContract } from './Contract/CliConfigContract.ts';

export class CliConfig implements CliConfigContract {
    static readonly id = ApplicationServiceId.CliConfigContract;

    constructor(
        public readonly namespace: string = 'App',
        public readonly dir: string = process.cwd(),
        public readonly version: string = ApplicationInfo.VERSION,
        public readonly environment: string = 'production',
        public readonly debugMode: boolean = false,
        public readonly timezone: string = 'UTC',
        public readonly key: string = 'some_secret_app_key',
        public readonly dataPath: string = 'App/Provider/Data',
        public readonly dataNamespace: string = 'App/Provider/Data',
        public readonly applicationName: string = 'valkyrja',
        public readonly defaultCommandName: string = CliCommandName.LIST,
        public readonly providers: ComponentProviderContract[] = [new CliWithHttpApplicationComponentProvider()],
        public readonly callbacks: ((app: ApplicationContract) => void)[] = [],
        public readonly inputReceivedMiddleware: string[] = [
            CliServerServiceId.CheckForHelpOptionsMiddleware,
            CliServerServiceId.CheckForVersionOptionsMiddleware,
            CliServerServiceId.CheckGlobalInteractionOptionsMiddleware,
        ],
        public readonly routeMatchedMiddleware: string[] = [],
        public readonly routeNotMatchedMiddleware: string[] = [CliServerServiceId.CheckCommandForTypoMiddleware],
        public readonly routeDispatchedMiddleware: string[] = [],
        public readonly throwableCaughtMiddleware: string[] = [
            CliServerServiceId.LogThrowableCaughtMiddleware,
            CliServerServiceId.OutputThrowableCaughtMiddleware,
        ],
        public readonly exitedMiddleware: string[] = [],
    ) {}
}

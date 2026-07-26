/*
 * This file is part of the Valkyrja package.
 *
 * (c) Melech Mizrachi <melechmizrachi@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Cast } from '../../../Type/Data/Cast.ts';
import type { ArgumentMode } from '../Enum/ArgumentMode.ts';
import type { ArgumentValueMode } from '../Enum/ArgumentValueMode.ts';
import type { OptionMode } from '../Enum/OptionMode.ts';
import type { OptionValueMode } from '../Enum/OptionValueMode.ts';
import type { CliHandlerReference, CliHelpTextReference, CliMiddlewareReference } from './RouteAttributeMetadata.ts';

/**
 * The options accepted by the CLI `@Route` decorator, mirroring the named
 * constructor arguments of PHP's `Valkyrja\Cli\Routing\Attribute\Route`.
 */
export interface CliRouteOptions {
    name: string;
    description: string;
    handler?: CliHandlerReference;
    helpText?: CliHelpTextReference;
    middleware?: CliMiddlewareReference[];
}

/**
 * The options accepted by the `@ArgumentParameter` decorator, mirroring PHP's
 * `Valkyrja\Cli\Routing\Attribute\ArgumentParameter`.
 */
export interface ArgumentParameterOptions {
    name: string;
    description: string;
    cast?: Cast | null;
    mode?: ArgumentMode;
    valueMode?: ArgumentValueMode;
}

/**
 * The options accepted by the `@OptionParameter` decorator, mirroring PHP's
 * `Valkyrja\Cli\Routing\Attribute\OptionParameter`.
 */
export interface OptionParameterOptions {
    name: string;
    description: string;
    valueDisplayName?: string;
    cast?: Cast | null;
    defaultValue?: string;
    shortNames?: string[];
    validValues?: string[];
    mode?: OptionMode;
    valueMode?: OptionValueMode;
}

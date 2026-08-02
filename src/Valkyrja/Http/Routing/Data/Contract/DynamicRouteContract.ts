/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import type { ParameterContract } from './ParameterContract.ts';
import type { RouteContract } from './RouteContract.ts';

export interface DynamicRouteContract extends RouteContract {
    getRegex(): string;
    withRegex(regex: string): this;
    getParameters(): ParameterContract[];
    withParameters(...parameters: ParameterContract[]): this;
    withAddedParameters(...parameters: ParameterContract[]): this;
}

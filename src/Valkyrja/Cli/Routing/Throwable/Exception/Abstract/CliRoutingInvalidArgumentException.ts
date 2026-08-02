/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CliInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/CliInvalidArgumentException.ts';

import type { CliRoutingThrowable } from '../../Contract/CliRoutingThrowable.ts';

export abstract class CliRoutingInvalidArgumentException
    extends CliInvalidArgumentException
    implements CliRoutingThrowable {}

/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CliInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/CliInvalidArgumentException.ts';

import type { CliMiddlewareThrowable } from '../../Contract/CliMiddlewareThrowable.ts';

export abstract class CliMiddlewareInvalidArgumentException
    extends CliInvalidArgumentException
    implements CliMiddlewareThrowable {}

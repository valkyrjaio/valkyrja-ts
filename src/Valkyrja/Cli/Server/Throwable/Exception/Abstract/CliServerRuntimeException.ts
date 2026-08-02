/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CliRuntimeException } from '../../../../Throwable/Exception/Abstract/CliRuntimeException.ts';

import type { CliServerThrowable } from '../../Contract/CliServerThrowable.ts';

export abstract class CliServerRuntimeException extends CliRuntimeException implements CliServerThrowable {}

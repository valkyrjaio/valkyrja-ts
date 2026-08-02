/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CliRuntimeException } from '../../../../Throwable/Exception/Abstract/CliRuntimeException.ts';

import type { CliInteractionThrowable } from '../../Contract/CliInteractionThrowable.ts';

export abstract class CliInteractionRuntimeException extends CliRuntimeException implements CliInteractionThrowable {}

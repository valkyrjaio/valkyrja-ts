/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.ts';

import type { CliThrowable } from '../../Contract/CliThrowable.ts';

export abstract class CliInvalidArgumentException extends ValkyrjaInvalidArgumentException implements CliThrowable {}

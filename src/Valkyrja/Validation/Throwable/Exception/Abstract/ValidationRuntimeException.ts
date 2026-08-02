/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.ts';
import type { ValidationThrowable } from '../../Contract/ValidationThrowable.ts';

export abstract class ValidationRuntimeException extends ValkyrjaRuntimeException implements ValidationThrowable {}

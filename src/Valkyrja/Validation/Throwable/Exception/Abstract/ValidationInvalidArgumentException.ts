/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ValkyrjaInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/ValkyrjaInvalidArgumentException.ts';
import type { ValidationThrowable } from '../../Contract/ValidationThrowable.ts';

export abstract class ValidationInvalidArgumentException
    extends ValkyrjaInvalidArgumentException
    implements ValidationThrowable {}

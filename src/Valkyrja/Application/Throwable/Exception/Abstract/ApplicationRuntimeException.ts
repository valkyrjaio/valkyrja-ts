/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.ts';

import type { ApplicationThrowable } from '../../Contract/ApplicationThrowable.ts';

export abstract class ApplicationRuntimeException extends ValkyrjaRuntimeException implements ApplicationThrowable {}

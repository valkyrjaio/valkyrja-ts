/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { ValkyrjaRuntimeException } from '../../../../Throwable/Exception/Abstract/ValkyrjaRuntimeException.ts';

import { type EventThrowable } from '../../Contract/EventThrowable.ts';

export abstract class EventRuntimeException extends ValkyrjaRuntimeException implements EventThrowable {}

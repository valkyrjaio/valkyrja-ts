import { CliRuntimeException } from '../../../../Throwable/Exception/Abstract/CliRuntimeException.js';

import type { CliRoutingThrowable } from '../../Contract/CliRoutingThrowable.js';

export abstract class CliRoutingRuntimeException extends CliRuntimeException implements CliRoutingThrowable {}

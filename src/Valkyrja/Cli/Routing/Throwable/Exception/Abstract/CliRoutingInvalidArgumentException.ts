import { CliInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/CliInvalidArgumentException.js';

import type { CliRoutingThrowable } from '../../Contract/CliRoutingThrowable.js';

export abstract class CliRoutingInvalidArgumentException extends CliInvalidArgumentException implements CliRoutingThrowable {}
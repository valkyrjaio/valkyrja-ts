import { CliInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/CliInvalidArgumentException.js';

import type { CliServerThrowable } from '../../Contract/CliServerThrowable.js';

export abstract class CliServerInvalidArgumentException extends CliInvalidArgumentException implements CliServerThrowable {}
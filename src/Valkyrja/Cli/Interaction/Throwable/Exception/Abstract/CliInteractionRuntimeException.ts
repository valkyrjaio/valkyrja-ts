import { CliRuntimeException } from '../../../../Throwable/Exception/Abstract/CliRuntimeException.js';

import type { CliInteractionThrowable } from '../../Contract/CliInteractionThrowable.js';

export abstract class CliInteractionRuntimeException extends CliRuntimeException implements CliInteractionThrowable {}

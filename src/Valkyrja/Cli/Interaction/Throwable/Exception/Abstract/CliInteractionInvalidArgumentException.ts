import { CliInvalidArgumentException } from '../../../../Throwable/Exception/Abstract/CliInvalidArgumentException.js';

import type { CliInteractionThrowable } from '../../Contract/CliInteractionThrowable.js';

export abstract class CliInteractionInvalidArgumentException extends CliInvalidArgumentException implements CliInteractionThrowable {}

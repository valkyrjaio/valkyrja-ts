/*
 * This file is part of the Valkyrja Framework package.
 *
 * Copyright (c) 2016-present Melech Mizrachi
 *
 * Released under the MIT License. See LICENSE.md for details.
 */

import { CancellationReason } from '../Enum/CancellationReason.ts';
import { Metadata } from '../Metadata/Metadata.ts';
import { Status } from '../Status/Status.ts';

import type { MetadataContract } from '../Metadata/Contract/MetadataContract.ts';
import type { StatusContract } from '../Status/Contract/StatusContract.ts';
import type { ServiceResponseContract } from './Contract/ServiceResponseContract.ts';

/**
 * Immutable {@link ServiceResponseContract} implementation.
 *
 * Built via the static factories ({@link ServiceResponse.ok}, {@link ServiceResponse.cancelled},
 * {@link ServiceResponse.unimplemented}, …) and refined with the `with*` copy methods. Messages are
 * held as an iterable of agnostic `unknown` payloads.
 */
export class ServiceResponse implements ServiceResponseContract {
    protected readonly status: StatusContract;
    protected readonly initialMetadata: MetadataContract;
    protected readonly trailingMetadata: MetadataContract;
    protected readonly messages: Iterable<unknown>;

    constructor(
        status: StatusContract,
        initialMetadata: MetadataContract = new Metadata(),
        trailingMetadata: MetadataContract = new Metadata(),
        messages: Iterable<unknown> = [],
    ) {
        this.status = status;
        this.initialMetadata = initialMetadata;
        this.trailingMetadata = trailingMetadata;
        this.messages = messages;
    }

    getStatus(): StatusContract {
        return this.status;
    }

    withStatus(status: StatusContract): ServiceResponseContract {
        return new ServiceResponse(status, this.initialMetadata, this.trailingMetadata, this.messages);
    }

    getInitialMetadata(): MetadataContract {
        return this.initialMetadata;
    }

    withInitialMetadata(metadata: MetadataContract): ServiceResponseContract {
        return new ServiceResponse(this.status, metadata, this.trailingMetadata, this.messages);
    }

    getTrailingMetadata(): MetadataContract {
        return this.trailingMetadata;
    }

    withTrailingMetadata(metadata: MetadataContract): ServiceResponseContract {
        return new ServiceResponse(this.status, this.initialMetadata, metadata, this.messages);
    }

    getMessages(): Iterable<unknown> {
        return this.messages;
    }

    withMessages(messages: Iterable<unknown>): ServiceResponseContract {
        return new ServiceResponse(this.status, this.initialMetadata, this.trailingMetadata, messages);
    }

    isCancellation(): boolean {
        return this.status.isCancellation();
    }

    // --- Factories -------------------------------------------------------------------------------

    static of(status: StatusContract): ServiceResponse {
        return new ServiceResponse(status);
    }

    static ok(...messages: [] | [unknown]): ServiceResponse {
        if (messages.length === 0) {
            return new ServiceResponse(Status.ok());
        }

        return new ServiceResponse(Status.ok(), new Metadata(), new Metadata(), messages);
    }

    static unimplemented(message: string | null = null): ServiceResponse {
        return new ServiceResponse(Status.unimplemented(message));
    }

    static cancelled(reason: CancellationReason | null = null): ServiceResponse {
        return new ServiceResponse(ServiceResponse.statusForReason(reason));
    }

    /**
     * Resolve the status for a cancellation reason: `DEADLINE_EXCEEDED` maps to that status,
     * everything else (including an unknown reason) maps to `CANCELLED`.
     */
    static statusForReason(reason: CancellationReason | null): StatusContract {
        return reason === CancellationReason.DEADLINE_EXCEEDED ? Status.deadlineExceeded() : Status.cancelled();
    }
}

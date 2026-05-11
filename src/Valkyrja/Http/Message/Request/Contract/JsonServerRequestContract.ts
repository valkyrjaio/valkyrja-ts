import type { ServerRequestContract } from './ServerRequestContract.js';
import type { ParsedJsonParamCollectionContract } from '../../Param/Contract/ParsedJsonParamCollectionContract.js';

export interface JsonServerRequestContract extends ServerRequestContract {
    getParsedJson(): ParsedJsonParamCollectionContract;
    withParsedJson(params: ParsedJsonParamCollectionContract): this;
}
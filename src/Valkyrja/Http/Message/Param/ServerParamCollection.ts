import type { ServerParamCollectionContract } from './Contract/ServerParamCollectionContract.js';
import { ParamCollection } from './Abstract/ParamCollection.js';

export class ServerParamCollection extends ParamCollection<string | string[]> implements ServerParamCollectionContract {}

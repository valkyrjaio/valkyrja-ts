import type { QueryParamCollectionContract } from './Contract/QueryParamCollectionContract.js';
import { ParamCollection } from './Abstract/ParamCollection.js';

export class QueryParamCollection extends ParamCollection<string | string[]> implements QueryParamCollectionContract {}

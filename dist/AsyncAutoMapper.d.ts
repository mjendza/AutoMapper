import { IMapping, ISourceProperty, IResolutionContext, IMapCallback } from './contracts';
import { AutoMapperBase } from './AutoMapperBase';
/**
 * AsyncAutoMapper implementation, for asynchronous mapping support when using AutoMapper.
 */
export declare class AsyncAutoMapper extends AutoMapperBase {
    private static asyncInstance;
    constructor();
    createMap(sourceKeyOrType: string | (new () => any), destinationKeyOrType: string | (new () => any)): any;
    createMapForMember(mapping: IMapping, property: ISourceProperty | null): void;
    createMapConvertUsing(mapping: IMapping, converterFunction: (ctx: IResolutionContext, cb: IMapCallback | undefined) => void): void;
    map(m: {
        [key: string]: IMapping;
    } | undefined, srcKey: string | (new () => any)): (dstKey: string | (new () => any), srcObj: any, cb: IMapCallback) => void;
    map(m: {
        [key: string]: IMapping;
    } | undefined, srcKey: string | (new () => any), dstKey: string | (new () => any)): (srcObj: any, cb: IMapCallback) => void;
    map(m: {
        [key: string]: IMapping;
    } | undefined, srcKey: string | (new () => any), dstKey?: string | (new () => any), sourceObject?: any): (cb: IMapCallback) => void;
    map(m: {
        [key: string]: IMapping;
    } | undefined, srcKey: string | (new () => any), dstKey?: string | (new () => any), sourceObject?: any, cb?: IMapCallback): void;
    mapWithMapping(mapping: IMapping, sourceObject: any, callback: IMapCallback | undefined): void;
    /**
     * Execute a mapping from the source array to a new destination array with explicit mapping configuration and supplied mapping options (using createMap).
     * @param mapping The mapping configuration for the current mapping keys/types.
     * @param sourceArray The source array to map.
     * @returns {Array<any>} Destination array.
     */
    private mapArray;
    private mapItemUsingTypeConverter;
    /**
     * Execute a mapping from the source object to a new destination object with explicit mapping configuration and supplied mapping options (using createMap).
     * @param mapping The mapping configuration for the current mapping keys/types.
     * @param sourceObject The source object to map.
     * @param destinationObject The destination object to map to.
     * @param callback The callback to call after async mapping has been executed.
     */
    private mapItem;
    /**
     * Execute a mapping from the source object property to the destination object property with explicit mapping configuration and supplied mapping options.
     * @param mapping The mapping configuration for the current mapping keys/types.
     * @param sourceObject The source object to map.
     * @param sourcePropertyName The source property to map.
     * @param destinationObject The destination object to map to.
     * @param callback The callback to call after async property mapping has been executed.
     */
    private mapProperty;
    private transform;
    private processTransformations;
    private processTransformation;
}

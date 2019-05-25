import { IConfiguration, ICreateMapFluentFunctions, IMapCallback } from './contracts';
import { AutoMapperBase } from './AutoMapperBase';
declare type IFluentFunc = ICreateMapFluentFunctions;
declare type stringOrClass = string | (new () => any);
export declare class AutoMapper extends AutoMapperBase {
    private static _instance;
    private _profiles;
    private _mappings;
    private _asyncMapper;
    static getInstance(): AutoMapper;
    /**
     * This class is intended to be a Singleton. Preferrably use getInstance()
     * function instead of using the constructor directly from code.
     */
    constructor();
    /**
     * Initializes the mapper with the supplied configuration.
     * @param {(config: IConfiguration) => void} configFunction Configuration function to call.
     */
    initialize(configFunction: (config: IConfiguration) => void): void;
    /**
     * Create a mapping profile.
     * @param {string} sourceKey The map source key.
     * @param {string} destinationKey The map destination key.
     * @returns {Core.ICreateMapFluentFunctions}
     */
    createMap(sourceKeyOrType: string | (new () => any), destinationKeyOrType: string | (new () => any)): IFluentFunc;
    /**
     * Execute a mapping from the source object to a new destination object with explicit mapping configuration and supplied mapping options (using createMap).
     * @param sourceKey Source key, for instance the source type name.
     * @param destinationKey Destination key, for instance the destination type name.
     * @param sourceObject The source object to map.
     * @returns {any} Destination object.
     */
    map(sourceKeyOrType: stringOrClass, destinationKeyOrType: stringOrClass, sourceObject: any): any;
    /**
     * Execute an asynchronous mapping from the source object to a new destination object with explicit mapping configuration and supplied mapping options (using createMap).
     * @param sourceKey Source key, for instance the source type name.
     * @param destinationKey Destination key, for instance the destination type name.
     * @param sourceObject The source object to map.
     * @param {IMapCallback} callback The callback to call when asynchronous mapping is complete.
     */
    mapAsync(sourceKeyOrType: string | (new () => any), destinationKeyOrType: string | (new () => any), sourceObject: any, callback: IMapCallback): any;
    /**
     * Validates mapping configuration by dry-running. Since JS does not fully support typing, it only checks if properties match on both
     * sides. The function needs IMapping.sourceTypeClass and IMapping.destinationTypeClass to function.
     * @param {boolean} strictMode Whether or not to fail when properties sourceTypeClass or destinationTypeClass are unavailable.
     */
    assertConfigurationIsValid(strictMode?: boolean): void;
    private createMapForAllMembers;
    private createMapIgnoreAllNonExisting;
    private createMapConvertToType;
    private createMapConvertUsing;
    private createMapWithProfile;
    private createMapWithProfileMergeMappings;
    private mapInternal;
    private mapArray;
    private mapItem;
    private mapItemUsingTypeConverter;
    private mapProperty;
    private transform;
    private processTransformation;
    private createMappingObjectForGivenKeys;
    private createMapGetFluentApiFunctions;
    private createMapForMember;
    private validateForMemberParameters;
    private createSourceProperty;
    private createDestinationProperty;
    private mergeSourceProperty;
    /**
     * handle property naming when the current property to merge is a mapFrom property
     */
    private handleMapFromProperties;
    private getDestinationProperty;
    private mergeDestinationProperty;
    private matchSourcePropertyByDestination;
    private findProperty;
}
export {};

import { IDestinationProperty, IMapping, IMemberCallback, IMemberConfigurationOptions } from './contracts';
declare type IDMCO = IMemberConfigurationOptions;
declare type stringOrClass = string | (new () => any);
/**
 * AutoMapper implementation, for both creating maps and performing maps. Comparable usage and functionality to the original
 * .NET AutoMapper library is the pursuit of this implementation.
 */
export declare abstract class AutoMapperBase {
    abstract map(sourceKeyOrType: any, destinationKeyOrType: any, sourceObject: any): any;
    abstract createMap(sourceKeyOrType: string | (new () => any), destinationKeyOrType: string | (new () => any)): any;
    protected getMapping(mappings: {
        [key: string]: IMapping;
    } | undefined, sourceKey: stringOrClass, destinationKey: stringOrClass | undefined): IMapping;
    protected getKey(keyStringOrType: string | (new () => any) | undefined): string;
    protected isArray(sourceObject: any): boolean;
    protected handleArray(mapping: IMapping, sourceArray: Array<any>, itemFunc: (sourceObject: any, destinationObject: any) => void): Array<any>;
    protected handleItem(mapping: IMapping, sourceObject: any, destinationObject: any, propertyFunction: (propertyName: string) => void): any;
    protected handleProperty(mapping: IMapping, sourceObject: any, sourcePropertyName: string, destinationObject: any, transformFunction: (destinationProperty: IDestinationProperty | null, memberOptions: IDMCO, callback?: IMemberCallback) => void, autoMappingCallbackFunction?: (dstPropVal: any) => void): void;
    protected setPropertyValue(mapping: IMapping, destinationProperty: IDestinationProperty, destinationObject: any, destinationPropertyValue: any): void;
    protected setPropertyValueByName(mapping: IMapping, destinationObject: any, destinationProperty: string, destinationPropertyValue: any): void;
    protected createDestinationObject(destinationType: new () => any): any;
    protected shouldProcessDestination(destination: IDestinationProperty, sourceObject: any): boolean;
    private handlePropertyWithAutoMapping;
    private getDestinationPropertyValue;
    private getDestinationPropertyName;
    private getPropertyMappings;
    private processMappedProperty;
    private createMemberConfigurationOptions;
}
export {};

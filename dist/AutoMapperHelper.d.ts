import { IMemberMappingMetaData } from './contracts';
export declare class AutoMapperHelper {
    static getClassName(classType: {
        new (): any;
    } | undefined): string;
    static getFunctionParameters(functionStr: string): Array<string>;
    static handleCurrying(func: Function, args: IArguments, closure: any): any;
    static getMappingMetadataFromTransformationFunction(destination: string, func: any, sourceMapping: boolean): IMemberMappingMetaData;
    private static getDestinationTransformation;
    private static getIgnoreFromString;
    private static getMapFromString;
    private static getFunctionCallIndex;
    private static getConditionFromFunction;
}

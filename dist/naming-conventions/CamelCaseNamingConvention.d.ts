import { INamingConvention } from '../contracts';
export declare class CamelCaseNamingConvention implements INamingConvention {
    splittingExpression: RegExp;
    separatorCharacter: string;
    transformPropertyName(sourcePropertyNameParts: string[]): string;
}

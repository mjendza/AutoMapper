import { INamingConvention } from '../contracts';
export declare class PascalCaseNamingConvention implements INamingConvention {
    splittingExpression: RegExp;
    separatorCharacter: string;
    transformPropertyName(sourcePropertyNameParts: string[]): string;
}

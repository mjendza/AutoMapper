/**
 * Converts source type to destination type instead of normal member mapping
 */
import { IResolutionContext, ITypeConverter } from './contracts';
export declare class TypeConverter implements ITypeConverter {
    /**
     * Performs conversion from source to destination type.
     * @param {IResolutionContext} resolutionContext Resolution context.
     * @returns {any} Destination object.
     */
    convert(resolutionContext: IResolutionContext): any;
}

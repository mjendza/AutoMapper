/**
 * Converts source type to destination type instead of normal member mapping
 */
import { ICreateMapFluentFunctions, INamingConvention, IProfile } from './contracts';
export declare class Profile implements IProfile {
    /** Profile name */
    profileName: string | undefined;
    /** Naming convention for source members */
    sourceMemberNamingConvention: INamingConvention | undefined;
    /** Naming convention for destination members */
    destinationMemberNamingConvention: INamingConvention | undefined;
    /**
     * Implement this method in a derived class and call the CreateMap method to associate that map with this profile.
     * Avoid calling the AutoMapper class / automapper instance from this method.
     */
    configure(): void;
    /**
     * Create a mapping profile.
     * @param {string} sourceKey The map source key.
     * @param {string} destinationKey The map destination key.
     * @returns {Core.ICreateMapFluentFunctions}
     */
    protected createMap(sourceKey: string, destinationKey: string): ICreateMapFluentFunctions;
}

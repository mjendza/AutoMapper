/**
 * AutoMapper configuration validator.
 */
export declare class AutoMapperValidator {
    /**
     * Validates mapping configuration by dry-running. Since JS does not
     * fully support typing, it only checks if properties match on both
     * sides. The function needs IMapping.sourceTypeClass and
     * IMapping.destinationTypeClass to function.
     * @param {boolean} strictMode Whether or not to fail when properties
     *                             sourceTypeClass or destinationTypeClass
     *                             are unavailable.
     */
    static assertConfigurationIsValid(mappings: any, strictMode: boolean): void;
    private static assertMappingConfiguration;
    private static validatePropertyMapping;
    private static validateSourcePropertyMapping;
    private static validateDestinationPropertyMapping;
    private static validateProperty;
    private static getDestinationProperty;
}

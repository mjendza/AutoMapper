"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeConverter = /** @class */ (function () {
    function TypeConverter() {
    }
    /**
     * Performs conversion from source to destination type.
     * @param {IResolutionContext} resolutionContext Resolution context.
     * @returns {any} Destination object.
     */
    TypeConverter.prototype.convert = function (resolutionContext) {
        // NOTE BL Unfortunately, TypeScript/JavaScript do not support abstract base classes.
        //         This is just one way around, please convince me about a better solution.
        throw new Error('The TypeConverter.convert method is abstract. Use a TypeConverter extension class instead.');
    };
    return TypeConverter;
}());
exports.TypeConverter = TypeConverter;

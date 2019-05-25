"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PascalCaseNamingConvention = /** @class */ (function () {
    function PascalCaseNamingConvention() {
        this.splittingExpression = /(^[A-Z]+(?=$|[A-Z]{1}[a-z0-9]+)|[A-Z]?[a-z0-9]+)/;
        this.separatorCharacter = '';
    }
    PascalCaseNamingConvention.prototype.transformPropertyName = function (sourcePropertyNameParts) {
        // Transform the splitted parts.
        var result = '';
        for (var index = 0, length = sourcePropertyNameParts.length; index < length; index++) {
            result += sourcePropertyNameParts[index].charAt(0).toUpperCase() +
                sourcePropertyNameParts[index].substr(1);
            //if (index < (length - 1)) {
            //    this.separatorCharacter;
            //}
        }
        return result;
    };
    return PascalCaseNamingConvention;
}());
exports.PascalCaseNamingConvention = PascalCaseNamingConvention;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AutoMapper_1 = require("./AutoMapper");
var Profile = /** @class */ (function () {
    function Profile() {
    }
    /**
     * Implement this method in a derived class and call the CreateMap method to associate that map with this profile.
     * Avoid calling the AutoMapper class / automapper instance from this method.
     */
    Profile.prototype.configure = function () {
        // do nothing
    };
    /**
     * Create a mapping profile.
     * @param {string} sourceKey The map source key.
     * @param {string} destinationKey The map destination key.
     * @returns {Core.ICreateMapFluentFunctions}
     */
    Profile.prototype.createMap = function (sourceKey, destinationKey) {
        var argsCopy = Array.prototype.slice.apply(arguments);
        for (var index = 0, length = argsCopy.length; index < length; index++) {
            if (argsCopy[index]) {
                // prefix sourceKey and destinationKey with 'profileName=>'
                argsCopy[index] = this.profileName + "=>" + argsCopy[index];
            }
        }
        // pass through using arguments to keep createMap's currying support fully functional.
        // @ts-ignore
        return AutoMapper_1.AutoMapper.getInstance().createMap.apply(AutoMapper_1.AutoMapper.getInstance(), argsCopy);
    };
    return Profile;
}());
exports.Profile = Profile;

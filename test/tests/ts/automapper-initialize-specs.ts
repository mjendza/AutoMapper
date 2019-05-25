import {
    IConfiguration,
    ICreateMapFluentFunctions,
    IMemberConfigurationOptions,
    INamingConvention,
    IResolutionContext,
    ISourceMemberConfigurationOptions
} from '../../../src/ts/contracts';
import {PascalCaseNamingConvention} from '../../../src/ts/naming-conventions/PascalCaseNamingConvention';
import {CamelCaseNamingConvention} from '../../../src/ts/naming-conventions/CamelCaseNamingConvention';
import {Profile} from '../../../src/ts/Profile';
import automapper from '../../../src/ts/AutoMapper';
import {expect} from 'chai';

class PascalCaseToCamelCaseMappingProfile extends Profile {
    public sourceMemberNamingConvention: INamingConvention | undefined;
    public destinationMemberNamingConvention: INamingConvention | undefined;

    public profileName = 'PascalCaseToCamelCase';

    public configure(): void {
        this.sourceMemberNamingConvention = new PascalCaseNamingConvention();
        this.destinationMemberNamingConvention = new CamelCaseNamingConvention();

        super.createMap('a', 'b');
    }
}

class ForAllMembersMappingProfile extends Profile {
    public sourceMemberNamingConvention: INamingConvention | undefined;
    public destinationMemberNamingConvention: INamingConvention | undefined;

    public profileName = 'ForAllMembers';

    private _fromKey: string;
    private _toKey: string;
    private _forAllMembersMappingSuffix: string;

    constructor(fromKey: string, toKey: string, forAllMembersMappingSuffix: string) {
        super();

        this._fromKey = fromKey;
        this._toKey = toKey;
        this._forAllMembersMappingSuffix = forAllMembersMappingSuffix;
    }

    public configure(): void {
        super.createMap(this._fromKey, this._toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions): any => opts.intermediatePropertyValue)
            .forMember('prop2', (opts: IMemberConfigurationOptions): any => opts.intermediatePropertyValue)
            .forAllMembers((destinationObject: any,
                            destinationPropertyName: string,
                            value: any): void => {
                destinationObject[destinationPropertyName] = value + this._forAllMembersMappingSuffix;
            });
    }
}

class ConvertUsingMappingProfile extends Profile {
    public sourceMemberNamingConvention: INamingConvention | undefined;
    public destinationMemberNamingConvention: INamingConvention | undefined;

    public profileName = 'ConvertUsing';

    private _fromKey: string;
    private _toKey: string;
    private _convertUsingSuffix: string;

    constructor(fromKey: string, toKey: string, convertUsingSuffix: string) {
        super();

        this._fromKey = fromKey;
        this._toKey = toKey;
        this._convertUsingSuffix = convertUsingSuffix;
    }

    public configure(): void {
        super.createMap(this._fromKey, this._toKey)
            .convertUsing((resolutionContext: IResolutionContext): any => {
                return {
                    prop1: resolutionContext.sourceValue.prop1 + this._convertUsingSuffix,
                    prop2: resolutionContext.sourceValue.prop2 + this._convertUsingSuffix
                };
            });
    }
}

class CamelCaseToPascalCaseMappingProfile extends Profile {
    public sourceMemberNamingConvention: INamingConvention | undefined;
    public destinationMemberNamingConvention: INamingConvention | undefined;

    public profileName = 'CamelCaseToPascalCase';

    public configure(): void {
        this.sourceMemberNamingConvention = new CamelCaseNamingConvention();
        this.destinationMemberNamingConvention = new PascalCaseNamingConvention();
    }
}

class ValidatedAgeMappingProfile extends Profile {
    public profileName = 'ValidatedAgeMappingProfile';

    public configure(): void {
        const sourceKey = '{808D9D7F-AA89-4D07-917E-A528F078E642}';
        const destinationKey = '{808D9D6F-BA89-4D17-915E-A528E178EE64}';

        this.createMap(sourceKey, destinationKey)
            .forMember('proclaimedAge', (opts: IMemberConfigurationOptions) => opts.ignore())
            .forMember('age', (opts: IMemberConfigurationOptions) => opts.mapFrom('ageOnId'))
            .convertToType(Person);
    }
}

class ValidatedAgeMappingProfile2 extends Profile {
    public profileName = 'ValidatedAgeMappingProfile2';

    public configure(): void {
        const sourceKey = '{918D9D7F-AA89-4D07-917E-A528F07EEF42}';
        const destinationKey = '{908D9D6F-BA89-4D17-915E-A528E988EE64}';

        this.createMap(sourceKey, destinationKey)
            .forMember('proclaimedAge', (opts: IMemberConfigurationOptions) => opts.ignore())
            .forMember('age', (opts: IMemberConfigurationOptions) => opts.mapFrom('ageOnId'))
            .convertToType(Person);
    }
}

class Person {
    public fullName: string | null = null;
    public age: number | null = null;
}

class BeerBuyingYoungster extends Person {
}

describe('AutoMapper.initialize', () => {
    let postfix = ' [f0e5ef4a-ebe1-32c4-a3ed-48f8b5a5fac7]';

    it.skip('should use created mapping profile', () => {
        // arrange
        var fromKey = '{5700E351-8D88-A327-A216-3CC94A308EDE}';
        var toKey = '{BB33A261-3CA9-A8FC-85E6-2C269F73728C}';

        automapper.initialize((config: IConfiguration) => {
            // @ts-ignore
            config.createMap(fromKey, toKey);
        });

        // act
        automapper.map(fromKey, toKey, {});

        // assert
    });

    it('should be able to use a naming convention to convert Pascal case to camel case', () => {
        automapper.initialize((config: IConfiguration) => {
            config.addProfile(new PascalCaseToCamelCaseMappingProfile());
        });

        const sourceKey = 'PascalCase';
        const destinationKey = 'CamelCase';

        const sourceObject = {FullName: 'John Doe'};

        automapper
            .createMap(sourceKey, destinationKey)
            .withProfile('PascalCaseToCamelCase');

        var result = automapper.map(sourceKey, destinationKey, sourceObject);

        expect(result).to.be.deep.equals({fullName: 'John Doe'});
    });

    it('should be able to use a naming convention to convert camelCase to PascalCase', () => {
        automapper.initialize((config: IConfiguration) => {
            config.addProfile(new CamelCaseToPascalCaseMappingProfile());
        });

        const sourceKey = 'CamelCase2';
        const destinationKey = 'PascalCase2';

        const sourceObject = {fullName: 'John Doe'};

        automapper
            .createMap(sourceKey, destinationKey)
            .withProfile('CamelCaseToPascalCase');

        var result = automapper.map(sourceKey, destinationKey, sourceObject);

        expect(result).to.be.deep.equals({FullName: 'John Doe'});
    });

    it('should be able to use forMember besides using a profile', () => {
        automapper.initialize((config: IConfiguration) => {
            config.addProfile(new CamelCaseToPascalCaseMappingProfile());
        });

        const sourceKey = 'CamelCase';
        const destinationKey = 'PascalCase';

        const sourceObject = {fullName: 'John Doe', age: 20};

        automapper
            .createMap(sourceKey, destinationKey)
            .forMember('theAge', (opts: IMemberConfigurationOptions) => opts.mapFrom('age'))
            .withProfile('CamelCaseToPascalCase');

        var result = automapper.map(sourceKey, destinationKey, sourceObject);

        expect(result).to.be.deep.equals({FullName: 'John Doe', theAge: sourceObject.age});
    });

    it('should use profile when only profile properties are specified', () => {
        automapper.initialize((config: IConfiguration) => {
            config.addProfile(new ValidatedAgeMappingProfile2());
        });

        const sourceKey = '{918D9D7F-AA89-4D07-917E-A528F07EEF42}';
        const destinationKey = '{908D9D6F-BA89-4D17-915E-A528E988EE64}';

        const sourceObject = {fullName: 'John Doe', proclaimedAge: 21, ageOnId: 15};

        automapper
            .createMap(sourceKey, destinationKey)
            .withProfile('ValidatedAgeMappingProfile2');

        var result = automapper.map(sourceKey, destinationKey, sourceObject);

        expect(result).to.be.deep.equals({fullName: 'John Doe', age: sourceObject.ageOnId});
        expect(result instanceof Person).to.be.true;
        expect(result instanceof BeerBuyingYoungster).not.to.be.true;
    });

    it('should fail when using a non-existing profile', () => {
        // arrange
        var caught = false;
        var profileName = 'Non-existing profile';
        const sourceKey = 'should fail when using ';
        const destinationKey = 'a non-existing profile';
        const sourceObject = {};

        // act
        try {
            automapper
                .createMap(sourceKey, destinationKey)
                .withProfile(profileName);
            var result = automapper.map(sourceKey, destinationKey, sourceObject);
        } catch (e) {
            caught = true;

            // assert
            expect(e.message).to.be.equal('Could not find profile with profile name \'' + profileName + '\'.');
        }

        if (!caught) {
            // assert
            //expect().fail('Using a non-existing mapping profile should result in an error.');
        }
    });

    it('should merge forMember calls when specifying the same destination property normally and using profile', () => {
        automapper.initialize((config: IConfiguration) => {
            config.addProfile(new ValidatedAgeMappingProfile());
        });

        const sourceKey = '{808D9D7F-AA89-4D07-917E-A528F078E642}';
        const destinationKey = '{808D9D6F-BA89-4D17-915E-A528E178EE64}';

        const sourceObject = {fullName: 'John Doe', proclaimedAge: 21, ageOnId: 15};

        automapper
            .createMap(sourceKey, destinationKey)
            .forMember('ageOnId', (opts: IMemberConfigurationOptions) => opts.ignore())
            .forMember('age', (opts: IMemberConfigurationOptions) => opts.mapFrom('proclaimedAge'))
            .convertToType(BeerBuyingYoungster)
            .withProfile('ValidatedAgeMappingProfile');

        var result = automapper.map(sourceKey, destinationKey, sourceObject);

        expect(result).to.be.deep.equals({fullName: 'John Doe', age: sourceObject.ageOnId});
        expect(result instanceof Person).to.be.true;
        expect(result instanceof BeerBuyingYoungster).not.to.be.true;
    });

    it.skip('should be able to use currying when calling initialize(cfg => cfg.createMap)', () => {
        // arrange
        var fromKey = '{808D9D7F-AA89-4D07-917E-A528F078EE64}';
        var toKey1 = '{B364C0A0-9E24-4424-A569-A4C14102147C}';
        var toKey2 = '{1055CA5A-4FC4-44CA-B4D8-B004F43D4440}';

        var source = {prop: 'Value'};

        // act
        var mapFromKeyCurry: (destinationKey: string) => ICreateMapFluentFunctions;

        automapper.initialize((config: IConfiguration) => {
            // @ts-ignore
            mapFromKeyCurry = config.createMap(fromKey);

            mapFromKeyCurry(toKey1)
                .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions) => {
                    opts.ignore();
                });

            mapFromKeyCurry(toKey2);
        });

        var result1 = automapper.map(fromKey, toKey1, source);
        var result2 = automapper.map(fromKey, toKey2, source);

        // assert
        // @ts-ignore
        expect(typeof mapFromKeyCurry === 'function').to.be.true;
        expect(result1.prop).to.be.undefined;
        expect(result2.prop).to.be.equal(source.prop);
    });

    it('should be able to use a mapping profile with forAllMemberMappings', () => {
        // arrange
        var fromKey = 'should be able to use a mapping profile ';
        var toKey = 'with forAllMemberMappings' + postfix;

        var source = {prop1: 'prop1', prop2: 'prop2'};
        var forAllMembersMappingSuffix = ' [forAllMembers]';

        automapper.initialize((config: IConfiguration) => {
            config.addProfile(new ForAllMembersMappingProfile(fromKey, toKey, forAllMembersMappingSuffix));
        });

        automapper
            .createMap(fromKey, toKey)
            .withProfile('ForAllMembers');

        // act
        var destination = automapper.map(fromKey, toKey, source);

        // assert
        expect(destination.prop1).to.be.equal(source.prop1 + forAllMembersMappingSuffix);
        expect(destination.prop2).to.be.equal(source.prop2 + forAllMembersMappingSuffix);
    });

    it('should be able to use a mapping profile with convertUsing', () => {
        // arrange
        var fromKey = 'should be able to use a mapping profile ';
        var toKey = 'with convertUsing' + postfix;

        var source = {prop1: 'prop1', prop2: 'prop2'};
        var convertUsingSuffix = ' [convertUsing]';

        automapper.initialize((config: IConfiguration) => {
            config.addProfile(new ConvertUsingMappingProfile(fromKey, toKey, convertUsingSuffix));
        });

        automapper
            .createMap(fromKey, toKey)
            .withProfile('ConvertUsing');

        // act
        var destination = automapper.map(fromKey, toKey, source);

        // assert
        expect(destination.prop1).to.be.equal(source.prop1 + convertUsingSuffix);
        expect(destination.prop2).to.be.equal(source.prop2 + convertUsingSuffix);
    });
});


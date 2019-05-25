import autoMapper from '../../../src/ts/autoMapper';
import {AutoMapperHelper} from '../../../src/ts/autoMapperHelper';
import {expect} from 'chai';
import {IMemberConfigurationOptions, ISourceMemberConfigurationOptions} from '../../../src/ts/contracts';
import automapper from '../../../src/ts/autoMapper';

describe('AutoMapper', () => {
    beforeEach(() => {
        // clear mappings (please, don't try this at home!)
        for (var key in (<any>automapper)._mappings) {
            if (!(<any>automapper)._mappings.hasOwnProperty(key)) {
                continue;
            }
            delete (<any>automapper)._mappings[key];
        }
    });

    it('should validate mapping using strictMode set to \'true\' (with valid mappings)', () => {
        // arrange
        automapper.createMap(AssertConfigPropertiesProp, AssertConfigPropertiesProp);

        // act and assert
        automapper.assertConfigurationIsValid(true);
    });

    it('should set strictMode to \'true\' when no value is provided and validate (with valid mappings)', () => {
        // arrange
        automapper.createMap(AssertConfigPropertiesProp, AssertConfigPropertiesProp);

        // act and assert
        automapper.assertConfigurationIsValid();
    });

    // // TODO Should work!
    // it('should set strictMode to \'true\' when no value is provided and validate (with valid mappings)', () => {
    //     // arrange
    //     automapper
    //         .createMap(AssertConfigPropertiesProp, AssertConfigPropertiesProp2)
    //         .forMember('prop2', (opts: AutoMapperJs.IMemberConfigurationOptions) => opts.mapFrom('prop'));

    //     // act and assert
    //     automapper.assertConfigurationIsValid();
    // });

    // it('should set strictMode to \'true\' when no value is provided and validate (with valid nested mappings)', () => {
    //     // arrange
    //     automapper.createMap(AssertConfigPropertiesNestedProp, AssertConfigPropertiesProp)
    //         .forMember('prop', (opts: IMemberConfigurationOptions) => opts.mapFrom('level1.level2'))
    //         .forSourceMember('level1.level2', (opts: ISourceMemberConfigurationOptions) => { opts.ignore(); });

    //     // act and assert
    //     automapper.assertConfigurationIsValid();
    // });

    it('should validate mapping using strictMode set to \'false\'', () => {
        // arrange
        automapper.createMap(AssertConfigPropertiesProp, AssertConfigPropertiesProp);
        automapper.createMap('AssertMappingConfigUntestableA', 'AssertMappingConfigUntestableB');

        // act and assert
        automapper.assertConfigurationIsValid(false);
    });

    it('should fail when validating mappings using strictMode set to \'true\' (with unvalidatable mappings)', () => {
        // arrange
        automapper.createMap(AssertConfigPropertiesProp, AssertConfigPropertiesProp);
        automapper.createMap('AssertMappingConfigUntestableA', 'AssertMappingConfigUntestableB');

        // act
        try {
            automapper.assertConfigurationIsValid(true);
        } catch (e) {
            // assert
            var errorMessage: string = e.message;
            var dekeyedErrorMessage =
                errorMessage.substr(0, errorMessage.indexOf('\'') + 1) +
                errorMessage.substr(errorMessage.lastIndexOf('\''));

            expect(dekeyedErrorMessage).to.be.equal(`Mapping '' cannot be validated, since mapping.sourceType or mapping.destinationType are unspecified.`);
            return;
        }

        // assert
        expect(null).to.throw('Expected error was not raised.');
    });

    it('should fail when auto mapping a property which does not exist on destination', () => {
        // arrange
        var srcType = AssertConfigPropertiesProp;
        var dstType = AssertConfigPropertiesProp2;

        var srcName = AutoMapperHelper.getClassName(srcType);
        var dstName = AutoMapperHelper.getClassName(dstType);

        automapper.createMap(srcType, dstType);

        try {
            // act
            automapper.assertConfigurationIsValid(true);
        } catch (e) {
            // assert
            expect(e.message).to.be.equal(
                `Mapping '${srcName}=>${dstName}' is invalid: Source member 'prop' is configured to be mapped, ` +
                `but does not exist on destination type (source: '${srcName}', destination: '${dstName}').`);
            return;
        }

        // assert
        expect(null).to.throw('Expected error was not raised.');
    });

    it('should succeed when mapping objects with ignored properties not existing on the other side', () => {
        // arrange
        var srcType = AssertConfigPropertiesProp;
        var dstType = AssertConfigPropertiesProp2;

        var srcName = AutoMapperHelper.getClassName(srcType);
        var dstName = AutoMapperHelper.getClassName(dstType);

        automapper
            .createMap(srcType, dstType)
            .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions) => {
                opts.ignore();
            })
            .forMember('prop2', (opts: IMemberConfigurationOptions) => {
                opts.ignore();
            });

        // act and assert
        automapper.assertConfigurationIsValid(true);
    });

    it('should fail when auto mapping a property which does not exist on source', () => {
        // arrange
        var srcType = AssertConfigPropertiesProp;
        var dstType = AssertConfigPropertiesPropProp2;

        var srcName = AutoMapperHelper.getClassName(srcType);
        var dstName = AutoMapperHelper.getClassName(dstType);

        automapper.createMap(srcType, dstType);

        expect(() => automapper.assertConfigurationIsValid(true)).to.throw(`Mapping '${srcName}=>${dstName}' is invalid: Destination member 'prop2' does not exist on source type (source: '${srcName}', destination: '${dstName}').`);

    });

    it('should fail when providing configuration for a property which does not exist on destination', () => {
        // arrange
        var srcType = AssertConfigPropertiesProp;
        var dstType = AssertConfigPropertiesPropProp2;

        var srcName = AutoMapperHelper.getClassName(srcType);
        var dstName = AutoMapperHelper.getClassName(dstType);

        automapper
            .createMap(srcType, dstType)
            .forMember('prop3', (opts: IMemberConfigurationOptions) => {
                opts.ignore();
            });

        expect(() => automapper.assertConfigurationIsValid(true))
            .to.throw(`Mapping '${srcName}=>${dstName}' is invalid: Destination member 'prop3' is configured, but does not exist on destination type (source: '${srcName}', destination: '${dstName}').`);

    });

    it('should fail when providing configuration for a property which does not exist on source', () => {
        // arrange
        var srcType = AssertConfigPropertiesProp;
        var dstType = AssertConfigPropertiesPropProp2;

        var srcName = AutoMapperHelper.getClassName(srcType);
        var dstName = AutoMapperHelper.getClassName(dstType);

        automapper
            .createMap(srcType, dstType)
            .forSourceMember('prop2', (opts: ISourceMemberConfigurationOptions) => {
                opts.ignore();
            });

        expect(() => automapper.assertConfigurationIsValid(true))
            .to.throw(`Mapping '${srcName}=>${dstName}' is invalid: Source member 'prop2' is configured, but does not exist on source type (source: '${srcName}', destination: '${dstName}').`);

    });
});

class AssertConfigPropertiesProp {
    public prop: string | undefined = undefined; // TODO Wiki: properties are only available when initialized: http://stackoverflow.com/a/20534039/702357
}

class AssertConfigPropertiesProp2 {
    public prop2: string | undefined = undefined;
}

class AssertConfigPropertiesPropProp2 {
    public prop: string | undefined = undefined;
    public prop2: string | undefined = undefined;
}

class AssertConfigPropertiesNestedProp {
    public level1: any = {
        level2: undefined
    };
}


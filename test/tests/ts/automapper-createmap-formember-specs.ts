import {
    IDestinationProperty,
    IDestinationTransformation,
    IMapping,
    IMemberConfigurationOptions,
    ISourceMemberConfigurationOptions,
    ISourceProperty
} from '../../../src/ts/contracts';
import {AutoMapper} from '../../../src/ts/autoMapper';
import {expect} from 'chai';
import {DestinationTransformationType} from '../../../src/ts/autoMapperEnumerations';

const automapper = AutoMapper.getInstance();
describe('AutoMapper.createMap.forMember', () => {
    let postfix = ' [f0e5ef36-e1ed-47c4-a86f-48f8b52e6897]';

    beforeEach(() => {
        // utils.registerTools(globalScope);
        // utils.registerCustomMatchers(globalScope);
    });

    it('should be able to use forMember to ignore a property', () => {
        // arrange
        var fromKey = 'should be able to use ';
        var toKey = 'forMember to ignore a property' + postfix;

        var ignoreFunc = (opts: IMemberConfigurationOptions) => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', ignoreFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equal(1);

        var destination = TestHelper.createDestinationProperty('prop', 'prop', 'prop', null, [{
            transformationType: 2,
            memberConfigurationOptionsFunc: ignoreFunc
        }], true, false);
        var source = TestHelper.createSourceProperty('prop', 'prop', 'prop', null, destination);

        expect(properties[0]).to.be.deep.equals(source);
    });

    it('should be able to use forMember with a constant value', () => {
        // arrange
        var fromKey = 'should be able to use forMember ';
        var toKey = 'with a constant value' + postfix;

        var constantResult = 2;

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', constantResult);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equal(1);

        var destination = TestHelper.createDestinationProperty('prop', 'prop', 'prop', null, [{transformationType: 1, constant: constantResult}], false, false);
        var source = TestHelper.createSourceProperty('prop', 'prop', 'prop', null, destination);

        expect(properties[0]).to.be.deep.equals(source);
    });

    it('should be able to use forMember with a function returning a constant value', () => {
        // arrange
        var fromKey = 'should be able to use forMember with ';
        var toKey = 'a function returning a constant value' + postfix;

        var func = (opts: IMemberConfigurationOptions) => 12;

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', func);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var destination = TestHelper.createDestinationProperty('prop', 'prop', 'prop', null, [{transformationType: 2, memberConfigurationOptionsFunc: func}], false, false);
        var source = TestHelper.createSourceProperty('prop', 'prop', 'prop', null, destination);

        expect(properties[0]).to.be.deep.equals(source);
    });

    it('should be able to use forMember to mapFrom and ignore a property', () => {
        // arrange
        var fromKey = 'should be able to use ';
        var toKey = 'forMember to mapFrom and ignore a property' + postfix;
        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('prop2');
        var ignoreFunc = (opts: IMemberConfigurationOptions) => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', mapFromFunc)
            .forMember('prop2', ignoreFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(2);

        var destination1 = TestHelper.createDestinationProperty('prop1', 'prop2', 'prop1', null, [{
            transformationType: 2,
            memberConfigurationOptionsFunc: mapFromFunc
        }], false, false);
        var source1 = TestHelper.createSourceProperty('prop2', 'prop2', 'prop1', null, destination1);

        var destination2 = TestHelper.createDestinationProperty('prop2', 'prop2', 'prop2', null, [{
            transformationType: 2,
            memberConfigurationOptionsFunc: ignoreFunc
        }], true, false);
        var source2 = TestHelper.createSourceProperty('prop2', 'prop2', 'prop2', null, destination2);

        expect(properties[0]).to.be.deep.equals(source1);
        expect(properties[1]).to.be.deep.equals(source2);
    });

    it('should be able to use mapFrom to map from property which is ignored itself on destination and do some more', () => {
        // arrange
        var fromKey = 'should be able to use mapFrom to map from ';
        var toKey = 'property which is ignored itself on destination and do some more' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => {
            opts.mapFrom('prop2');
        };
        var ignoreFunc = (opts: IMemberConfigurationOptions) => {
            opts.ignore();
        };
        var ignoreSourceFunc = (opts: ISourceMemberConfigurationOptions) => {
            opts.ignore();
        };
        var constantFunc = () => {
            return 12;
        };

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', mapFromFunc)
            .forMember('prop2', ignoreFunc)
            .forSourceMember('prop3', ignoreSourceFunc)
            .forMember('prop4', constantFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(4);

        var destination1 = TestHelper.createDestinationProperty('prop1', 'prop2', 'prop1', null, [{
            transformationType: 2,
            memberConfigurationOptionsFunc: mapFromFunc
        }], false, false);
        var source1 = TestHelper.createSourceProperty('prop2', 'prop2', 'prop1', null, destination1);

        var destination2 = TestHelper.createDestinationProperty('prop2', 'prop2', 'prop2', null, [{
            transformationType: 2,
            memberConfigurationOptionsFunc: ignoreFunc
        }], true, false);
        var source2 = TestHelper.createSourceProperty('prop2', 'prop2', 'prop2', null, destination2);

        var destination3 = TestHelper.createDestinationProperty('prop3', 'prop3', 'prop3', null, [{
            transformationType: DestinationTransformationType.SourceMemberOptions,
            sourceMemberConfigurationOptionsFunc: ignoreSourceFunc
        }], true, true);
        var source3 = TestHelper.createSourceProperty('prop3', 'prop3', 'prop3', null, destination3);

        var destination4 = TestHelper.createDestinationProperty('prop4', 'prop4', 'prop4', null, [{
            transformationType: 2,
            memberConfigurationOptionsFunc: constantFunc
        }], false, false);
        var source4 = TestHelper.createSourceProperty('prop4', 'prop4', 'prop4', null, destination4);

        expect(properties[0]).to.be.deep.equals(source1);
        expect(properties[1]).to.be.deep.equals(source2);
        expect(properties[2]).to.be.deep.equals(source3);
        expect(properties[3]).to.be.deep.equals(source4);
    });

    it('should accept multiple forMember calls for the same destination property and overwrite with the last one specified', () => {
        // arrange
        var fromKey = 'should accept multiple forMember calls for ';
        var toKey = 'the same destination property and overwrite with the last one specified' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('prop2');
        var ignoreFunc = (opts: IMemberConfigurationOptions) => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', mapFromFunc)
            .forMember('prop1', ignoreFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var destination = TestHelper.createDestinationProperty(
            'prop1', 'prop2', 'prop1', null, [
                {transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc},
                {transformationType: 2, memberConfigurationOptionsFunc: ignoreFunc}
            ],
            true, false);
        var source = TestHelper.createSourceProperty('prop2', 'prop2', 'prop1', null, destination);

        expect(properties[0]).to.be.deep.equals(source);
    });

    it('should be able to use stack forMember calls to map a source property to a destination property using multiple mapping steps', () => {
        // arrange
        var fromKey = 'should be able to use stack forMember calls to map a ';
        var toKey = 'source property to a destination property using multiple mapping steps' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('birthdayString');
        var makeDateFunc = (opts: IMemberConfigurationOptions) => new Date(opts.intermediatePropertyValue);

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('birthday', mapFromFunc)
            .forMember('birthday', makeDateFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var destination = TestHelper.createDestinationProperty(
            'birthday', 'birthdayString', 'birthday', null,
            [
                {transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc},
                {transformationType: 2, memberConfigurationOptionsFunc: makeDateFunc}
            ], false, false);
        var source = TestHelper.createSourceProperty('birthdayString', 'birthdayString', 'birthday', null, destination);

        expect(properties[0]).to.be.deep.equals(source);
    });

    it('should be able to use stack forMember calls to map a source property to a destination property using multiple mapping steps in any order', () => {
        // arrange
        var fromKey = 'should be able to use stack forMember calls to map a source property ';
        var toKey = 'to a destination property using multiple mapping steps in any order' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('birthdayString');
        var makeDateFunc = (opts: IMemberConfigurationOptions) => new Date(opts.intermediatePropertyValue);

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('birthday', makeDateFunc)
            .forMember('birthday', mapFromFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var destination = TestHelper.createDestinationProperty(
            'birthday', 'birthdayString', 'birthday', null,
            [
                {transformationType: 2, memberConfigurationOptionsFunc: makeDateFunc},
                {transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc}
            ], false, false);
        var source = TestHelper.createSourceProperty('birthdayString', 'birthdayString', 'birthday', null, destination);

        expect(properties[0]).to.be.deep.equals(source);
    });

    it('should be able to stack forMember calls and still ignore', () => {
        // arrange
        var fromKey = 'should be able to stack forMember ';
        var toKey = 'calls and still ignore' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('birthdayString');
        var makeDateFunc = (opts: IMemberConfigurationOptions) => new Date(opts.intermediatePropertyValue);
        var ignoreFunc = (opts: IMemberConfigurationOptions) => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('birthday', mapFromFunc)
            .forMember('birthday', makeDateFunc)
            .forMember('birthday', ignoreFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var destination = TestHelper.createDestinationProperty(
            'birthday', 'birthdayString', 'birthday', null,
            [
                {transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc},
                {transformationType: 2, memberConfigurationOptionsFunc: makeDateFunc},
                {transformationType: 2, memberConfigurationOptionsFunc: ignoreFunc}
            ], true, false);
        var source = TestHelper.createSourceProperty('birthdayString', 'birthdayString', 'birthday', null, destination);

        expect(properties[0]).to.be.deep.equals(source);
    });

    it('should be able to use forMember to map a nested source property to a flat destination property', () => {
        // arrange
        var fromKey = 'should be able to use forMember to map a nested source ';
        var toKey = 'property to a flat destination property' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1.srcLevel2');

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('dstLevel1', mapFromFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1.srcLevel2', 'dstLevel1', null, [{
            transformationType: 2,
            memberConfigurationOptionsFunc: mapFromFunc
        }], false, false);

        var srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1.srcLevel2', 'dstLevel1', null, null);
        var srcLevel2 = TestHelper.createSourceProperty('srcLevel2', 'srcLevel1.srcLevel2', 'dstLevel1', srcLevel1, dstLevel1);
        srcLevel1.children.push(srcLevel2);

        expect(properties[0]).to.be.deep.equals(srcLevel1);
    });

    it('should be able to use stacked forMember calls to map a nested source property to a flat destination property', () => {
        // arrange
        var fromKey = 'should be able to use stacked forMember calls to map a nested source ';
        var toKey = 'property to a flat destination property' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1.srcLevel2');
        var useIntermediateFunc = (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + 'addition';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('dstLevel1', mapFromFunc)
            .forMember('dstLevel1', useIntermediateFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1.srcLevel2', 'dstLevel1', null,
            [
                {transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc},
                {transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: useIntermediateFunc}
            ], false, false);

        var srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1.srcLevel2', 'dstLevel1', null, null);
        var srcLevel2 = TestHelper.createSourceProperty('srcLevel2', 'srcLevel1.srcLevel2', 'dstLevel1', srcLevel1, dstLevel1);
        srcLevel1.children.push(srcLevel2);

        expect(properties[0]).to.be.deep.equal(srcLevel1);
    });

    it('should be able to use forMember to map a flat source property to a nested destination property', () => {
        // arrange
        var fromKey = 'should be able to use forMember to map a flat source ';
        var toKey = 'property to a nested destination property' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1');

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('dstLevel1.dstLevel2', mapFromFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, [], false, false);
        var dstLevel2 = TestHelper.createDestinationProperty('dstLevel2', 'srcLevel1', 'dstLevel1.dstLevel2', dstLevel1, [{
            transformationType: 2,
            memberConfigurationOptionsFunc: mapFromFunc
        }], false, false);
        dstLevel1.child = dstLevel2;

        var srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, dstLevel1);

        expect(properties[0]).to.be.deep.equals(srcLevel1);
    });

    it('should be able to use stacked forMember calls to forMember calls to map a flat source property to a nested destination property', () => {
        // arrange
        var fromKey = 'should be able to use stacked forMember calls to forMember calls to map a flat source ';
        var toKey = 'property to a nested destination property' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1');
        var useIntermediateFunc = (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + 'addition';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('dstLevel1.dstLevel2', mapFromFunc)
            .forMember('dstLevel1.dstLevel2', useIntermediateFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, [], false, false);
        var dstLevel2 = TestHelper.createDestinationProperty('dstLevel2', 'srcLevel1', 'dstLevel1.dstLevel2', dstLevel1,
            [
                {transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc},
                {transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: useIntermediateFunc}
            ], false, false);
        dstLevel1.child = dstLevel2;

        var srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, dstLevel1);

        expect(properties[0]).to.be.deep.equals(srcLevel1);
    });

    it('should be able to use stacked forMember calls to forMember calls to map a flat source property to a nested destination property in any order', () => {
        // arrange
        var fromKey = 'should be able to use stacked forMember calls to forMember calls to map a flat source ';
        var toKey = 'property to a nested destination property in any order' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1');
        var useIntermediateFunc = (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + 'addition';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('dstLevel1.dstLevel2', useIntermediateFunc)
            .forMember('dstLevel1.dstLevel2', mapFromFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, [], false, false);
        var dstLevel2 = TestHelper.createDestinationProperty('dstLevel2', 'srcLevel1', 'dstLevel1.dstLevel2', dstLevel1,
            [
                {transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: useIntermediateFunc},
                {transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc}
            ], false, false);
        dstLevel1.child = dstLevel2;

        var srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, dstLevel1);

        expect(properties[0]).to.be.deep.equals(srcLevel1);
    });

    it('should be able to use forMember to map to a nested destination using mapFrom rebasing', () => {
        //arrange
        var fromKey = 'should be able to use forMember to map to a ';
        var toKey = 'nested destination using mapFrom rebasing' + postfix;

        var useIntermediateFunc = (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + ' - sure works!';
        var mapFromFunc1 = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1.srcLevel2.srcLevel3');
        var mapFromFunc2 = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1.srcLevel2');

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('dstLevel1.dstLevel2', useIntermediateFunc)
            .forMember('dstLevel1.dstLevel2', mapFromFunc1)
            .forMember('dstLevel1.dstLevel2', mapFromFunc2);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', null, [], false, false);
        var dstLevel2 = TestHelper.createDestinationProperty('dstLevel2', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', dstLevel1,
            [
                {transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: useIntermediateFunc},
                {transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc1,},
                {transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc2}
            ], false, false);
        dstLevel1.child = dstLevel2;

        var srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', null, null);
        var srcLevel2 = TestHelper.createSourceProperty('srcLevel2', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', srcLevel1, dstLevel1);
        srcLevel1.children.push(srcLevel2);

        expect(properties[0]).to.be.deep.equals(srcLevel1);
    });

    it('should be able to use forMember to map a nested source property to a nested destination property', () => {
        // arrange
        var fromKey = 'should be able to use forMember to map a nested source ';
        var toKey = 'property to a nested destination property' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1.srcLevel2');
        var ignoreFunc = (opts: IMemberConfigurationOptions) => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('dstLevel1.dstLevel2', mapFromFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(1);

        var dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', null, [], false, false);
        var dstLevel2 = TestHelper.createDestinationProperty('dstLevel2', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', dstLevel1, [{
            transformationType: 2,
            memberConfigurationOptionsFunc: mapFromFunc
        }], false, false);
        dstLevel1.child = dstLevel2;

        var srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', null, null);
        var srcLevel2 = TestHelper.createSourceProperty('srcLevel2', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', srcLevel1, dstLevel1);
        srcLevel1.children.push(srcLevel2);

        expect(properties[0]).to.be.deep.equals(srcLevel1);
    });

    it('should be able to use forMember to map a couple of nested source properties to a couple of nested destination properties', () => {
        // arrange
        var fromKey = 'should be able to use forMember to map a couple of nested source ';
        var toKey = 'properties to a couple of nested destination properties' + postfix;

        var mapFromHomeAddressAddress2 = (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('homeAddress.address2');
            },
            mapFromHomeAddressCity = (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('homeAddress.city');
            },
            mapFromHomeAddressState = (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('homeAddress.state');
            },
            mapFromHomeAddressZip = (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('homeAddress.zip');
            };

        var mapFromBusinessAddressAddress1 = (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('businessAddress.address1');
            },
            mapFromBusinessAddressAddress2 = (opts: IMemberConfigurationOptions) => <any>null,
            mapFromBusinessAddressCity = (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('businessAddress.city');
            },
            mapFromBusinessAddressState = (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('businessAddress.state');
            },
            mapFromBusinessAddressZip = (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('businessAddress.zip');
            };

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('homeAddress.address2', mapFromHomeAddressAddress2)
            .forMember('homeAddress.city', mapFromHomeAddressCity)
            .forMember('homeAddress.state', mapFromHomeAddressState)
            .forMember('homeAddress.zip', mapFromHomeAddressZip)

            .forMember('businessAddress.address1', mapFromBusinessAddressAddress1)
            .forMember('businessAddress.address2', mapFromBusinessAddressAddress2)
            .forMember('businessAddress.city', mapFromBusinessAddressCity)
            .forMember('businessAddress.state', mapFromBusinessAddressState)
            .forMember('businessAddress.zip', mapFromBusinessAddressZip);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equals(9);

        var assertFunc = (srcLevel1: string, srcLevel2: string, dstLevel1: string, dstLevel2: string, func: any, propertyIndex: number): void => {
            var dstPropLevel1 = TestHelper.createDestinationProperty(dstLevel1, srcLevel1 + '.' + srcLevel2, dstLevel1 + '.' + dstLevel2, null, [], false, false);
            var dstPropLevel2 = TestHelper.createDestinationProperty(dstLevel2, srcLevel1 + '.' + srcLevel2, dstLevel1 + '.' + dstLevel2, dstPropLevel1, [{
                transformationType: 2,
                memberConfigurationOptionsFunc: func
            }], false, false);
            dstPropLevel1.child = dstPropLevel2;

            var srcPropLevel1 = TestHelper.createSourceProperty(srcLevel1, srcLevel1 + '.' + srcLevel2, dstLevel1 + '.' + dstLevel2, null, null);
            var srcPropLevel2 = TestHelper.createSourceProperty(srcLevel2, srcLevel1 + '.' + srcLevel2, dstLevel1 + '.' + dstLevel2, srcPropLevel1, dstPropLevel1);
            srcPropLevel1.children.push(srcPropLevel2);

            expect(properties[propertyIndex]).to.be.deep.equals(srcPropLevel1);
        };

        assertFunc('homeAddress', 'address2', 'homeAddress', 'address2', mapFromHomeAddressAddress2, 0);
        assertFunc('homeAddress', 'city', 'homeAddress', 'city', mapFromHomeAddressCity, 1);
        assertFunc('homeAddress', 'state', 'homeAddress', 'state', mapFromHomeAddressState, 2);
        assertFunc('homeAddress', 'zip', 'homeAddress', 'zip', mapFromHomeAddressZip, 3);

        assertFunc('businessAddress', 'address1', 'businessAddress', 'address1', mapFromBusinessAddressAddress1, 4);
        assertFunc('businessAddress', 'address2', 'businessAddress', 'address2', mapFromBusinessAddressAddress2, 5);
        assertFunc('businessAddress', 'city', 'businessAddress', 'city', mapFromBusinessAddressCity, 6);
        assertFunc('businessAddress', 'state', 'businessAddress', 'state', mapFromBusinessAddressState, 7);
        assertFunc('businessAddress', 'zip', 'businessAddress', 'zip', mapFromBusinessAddressZip, 8);
    });

    // it('should work', () => {
    //     // arrange
    //     // act
    //     // assert
    // });

});

class TestHelper {
    public static assertAndGetMapping(fromKey: string, toKey: string): IMapping {
        var mapping = <IMapping>(<any>automapper)._mappings[fromKey + toKey]; // test only => unsupported in production!
        expect(mapping).to.be.not.null;
        return mapping;
    }

    public static assertAndGetProperty(fromKey: string, toKey: string): ISourceProperty[] {
        var mapping = TestHelper.assertAndGetMapping(fromKey, toKey);
        return mapping.properties;
    }

    public static createDestinationProperty(name: string, sourceName: string, destinationName: string, parent: IDestinationProperty | null, transformations: IDestinationTransformation[], ignore: boolean, sourceMapping: boolean): IDestinationProperty {
        const property = <IDestinationProperty>{
            name: name,
            sourcePropertyName: sourceName,
            destinationPropertyName: destinationName,
            parent: parent,
            level: !parent ? 0 : parent.level + 1,
            child: undefined,
            transformations: transformations ? transformations : [],
            ignore: ignore,
            conditionFunction: undefined,
            sourceMapping: sourceMapping
        };
        return property;
    }

    public static createSourceProperty(name: string, sourceName: string, destinationName: string, parent: ISourceProperty | null, destination: IDestinationProperty | null): ISourceProperty {
        var property = <ISourceProperty>{
            name: name,
            sourcePropertyName: sourceName,
            destinationPropertyName: destinationName,
            parent: parent,
            level: !parent ? 0 : parent.level + 1,
            children: [],
            destination: destination
        };
        return property;
    }
}


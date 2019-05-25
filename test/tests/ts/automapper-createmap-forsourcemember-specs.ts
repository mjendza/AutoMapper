import {AutoMapper} from '../../../src/ts/autoMapper';
import {IDestinationProperty, IMapping, IMemberConfigurationOptions, ISourceMemberConfigurationOptions, ISourceProperty} from '../../../src/ts/contracts';
import {DestinationTransformationType} from '../../../src/ts/autoMapperEnumerations';
import {expect} from 'chai';

const automapper = AutoMapper.getInstance();

describe('AutoMapper.createMap.forSourceMember', () => {
    let postfix = ' [5fbe5d7c-9348-4c0b-a2d8-21f7d16fd7d4]';

    it('should be able to use forSourceMember to ignore a property', () => {
        // arrange
        var fromKey = 'should be able to use ';
        var toKey = 'forSourceMember to ignore a property' + postfix;

        var ignoreFunc = (opts: ISourceMemberConfigurationOptions):void => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forSourceMember('prop', ignoreFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equal(1);
        expect(properties[0]).to.be.deep.equals(<ISourceProperty>{
            name: 'prop',
            destinationPropertyName: 'prop',
            sourcePropertyName: 'prop',
            parent: null,
            level: 0,
            children: [],
            destination: {
                name: 'prop',
                destinationPropertyName: 'prop',
                sourcePropertyName: 'prop',
                conditionFunction: undefined,
                parent: null,
                level: 0,
                child: undefined,
                transformations: [{transformationType: DestinationTransformationType.SourceMemberOptions, sourceMemberConfigurationOptionsFunc: ignoreFunc}],
                sourceMapping: true,
                ignore: true
            }
        });
    });

    it('should be able to custom map a source property using the forSourceMember function', () => {
        // arrange
        var fromKey = 'should be able to custom map a source ';
        var toKey = 'property using the forSourceMember function' + postfix;

        var customMappingFunc = (opts: ISourceMemberConfigurationOptions):string => 'Yeah!';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forSourceMember('prop', customMappingFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equal(1);
        expect(properties[0]).to.be.deep.equals(<ISourceProperty>{
            name: 'prop',
            destinationPropertyName: 'prop',
            sourcePropertyName: 'prop',
            parent: null,
            level: 0,
            children: [],
            destination: {
                name: 'prop',
                destinationPropertyName: 'prop',
                sourcePropertyName: 'prop',
                conditionFunction: undefined,
                parent: null,
                level: 0,
                child: undefined,
                transformations: [{transformationType: DestinationTransformationType.SourceMemberOptions, sourceMemberConfigurationOptionsFunc: customMappingFunc}],
                sourceMapping: true,
                ignore: false
            }
        });
    });

    it('should be able to ignore a source property already specified (by forMember) using the forSourceMember function', () => {
        // arrange
        var fromKey = 'should be able to ignore a source property already specified ';
        var toKey = '(by forMember) using the forSourceMember function' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions): void => opts.mapFrom('prop2');
        var ignoreFunc = (opts: ISourceMemberConfigurationOptions): void => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', mapFromFunc)
            .forSourceMember('prop2', ignoreFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equal(1);
        expect(properties[0]).to.be.deep.equals(<ISourceProperty>{
            name: 'prop2',
            destinationPropertyName: 'prop1',
            sourcePropertyName: 'prop2',
            parent: null,
            level: 0,
            children: [],
            destination: {
                name: 'prop1',
                destinationPropertyName: 'prop1',
                sourcePropertyName: 'prop2',
                parent: null,
                level: 0,
                child: undefined,
                conditionFunction: undefined,
                transformations: [
                    {transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc},
                    {transformationType: DestinationTransformationType.SourceMemberOptions, sourceMemberConfigurationOptionsFunc: ignoreFunc}
                ],
                ignore: true,
                sourceMapping: true
            }
        });
    });

    it('should be able to use forSourceMember to ignore a property and use forMember.mapFrom to write to a custom destination at the same time', () => {
        // arrange
        var fromKey = 'should be able to use forSourceMember to ignore a property ';
        var toKey = 'and use forMember.mapFrom to write to a custom destination at the same time' + postfix;

        var mapFromFunc = (opts: IMemberConfigurationOptions): void => opts.mapFrom('prop2');
        var ignoreFunc = (opts: ISourceMemberConfigurationOptions): void => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forSourceMember('prop1', ignoreFunc)
            .forMember('prop1', mapFromFunc);

        // assert
        var properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).to.be.equal(2);
        expect(properties[0]).to.be.deep.equals(<ISourceProperty>{
            name: 'prop1',
            destinationPropertyName: 'prop1',
            sourcePropertyName: 'prop1',
            parent: null,
            level: 0,
            children: [],
            destination: <IDestinationProperty>{
                name: 'prop1',
                destinationPropertyName: 'prop1',
                sourcePropertyName: 'prop1',
                conditionFunction: undefined,
                parent: null,
                level: 0,
                child: undefined,
                transformations: [{transformationType: DestinationTransformationType.SourceMemberOptions, sourceMemberConfigurationOptionsFunc: ignoreFunc}],
                ignore: true,
                sourceMapping: true
            }
        });
        expect(properties[1]).to.be.deep.equal(<ISourceProperty>{
            name: 'prop2',
            destinationPropertyName: 'prop1',
            sourcePropertyName: 'prop2',
            parent: null,
            level: 0,
            children: [],
            destination: <IDestinationProperty>{
                name: 'prop1',
                destinationPropertyName: 'prop1',
                sourcePropertyName: 'prop2',
                conditionFunction: undefined,
                parent: null,
                level: 0,
                child: undefined,
                transformations: [{transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc}],
                ignore: false,
                sourceMapping: false
            }
        });
    });

    it('should fail when forSourceMember is used with anything else than a function', () => {
        // arrange
        var fromKey = 'should be able to use ';
        var toKey = 'forSourceMember to ignore a property' + postfix;

        var ignoreFunc = (opts: ISourceMemberConfigurationOptions):void => opts.ignore();

            expect(() => automapper
                .createMap(fromKey, toKey)
                .forSourceMember('prop', <any>12))
                .to.be.throw('Configuration of forSourceMember has to be a function with one (sync) or two (async) options parameters.');
    });
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
}


import automapper, {AutoMapper} from '../../../src/ts/autoMapper';
import {IMapping, IMemberConfigurationOptions, IResolutionContext, ISourceMemberConfigurationOptions, ISourceProperty} from '../../../src/ts/contracts';
import {DestinationTransformationType} from '../../../src/ts/autoMapperEnumerations';
import {expect} from 'chai';
import {TypeConverter} from '../../../src/ts/typeConverter';
import {Mock, It, Times} from 'typemoq';
describe('AutoMapper', () => {
    let postfix = ' [0ef5ef45-4f21-47c4-a86f-48fb852e6897]';

    it('should have a global automapper object', () => {
        expect(automapper).to.be.not.undefined;
        expect(automapper).to.be.not.null;

        expect(automapper.createMap).to.be.not.undefined;
        expect(automapper.createMap).to.be.not.null;
        expect(typeof automapper.createMap === 'function').to.be.true;

        expect(automapper.map).to.be.not.undefined;
        expect(automapper.map).to.be.not.null;
        expect(typeof automapper.map === 'function').to.be.true;
    });

    it('should return the Singleton instance when instantiating the Singleton directly', () => {
        // arrange
        var caught = false;

        // act
        var mapper = new AutoMapper();
        expect(automapper).to.be.equal(mapper);
    });

    it('should use created mapping profile', () => {
        // arrange
        var fromKey = '{5700E351-8D88-4327-A216-3CC94A308EDF}';
        var toKey = '{BB33A261-3CA9-48FC-85E6-2C269F73728D}';

        automapper.createMap(fromKey, toKey);

        // act
        automapper.map(fromKey, toKey, {});

        // assert
    });

    it('should fail when using a non-existing mapping profile', () => {
        // arrange
        var caught = false;

        var fromKey = '{5AEFD48C-4472-41E7-BA7E-0977A864E116}';
        var toKey = '{568DCA5E-477E-4739-86B2-38BB237B8EF8}';

        // act
        try {
            automapper.map(fromKey, toKey, {});
        } catch (e) {
            caught = true;

            // assert
            expect(e.message).to.be.equal('Could not find map object with a source of ' + fromKey + ' and a destination of ' + toKey);
        }

        if (!caught) {
            // assert
            //expect(null).to.be.fail('Using a non-existing mapping profile should result in an error.');
        }
    });

    it('should be able to use forAllMemberMappings', () => {
        // arrange
        var fromKey = '{5700E351-8D88-4327-A216-3CCBHJ808EDF}';
        var toKey = '{BB33A261-3CA9-48FC-85E6-2C269FDFT28D}';

        var source = {prop1: 'prop1', prop2: 'prop2'};
        var suffix = ' [forAllMembers]';

        automapper.createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions): any => opts.intermediatePropertyValue)
            .forMember('prop2', (opts: IMemberConfigurationOptions): any => opts.intermediatePropertyValue)
            .forAllMembers((destinationObject: any,
                            destinationPropertyName: string,
                            value: any): void => {
                destinationObject[destinationPropertyName] = value + suffix;
            });

        // act
        var destination = automapper.map(fromKey, toKey, source);

        // assert
        expect(destination.prop1).to.be.equal(source.prop1 + suffix);
        expect(destination.prop2).to.be.equal(source.prop2 + suffix);
    });

    it('should be able to use forAllMemberMappings when automapping', () => {
        // arrange
        var fromKey = '{5700E351-8D88-4327-A216-3CCBHJ808EDF}';
        var toKey = '{BB33A261-3CA9-48FC-85E6-2C269FDFT28D}';

        var source = {prop1: 'prop1', prop2: 'prop2'};
        var suffix = ' [forAllMembers]';

        automapper.createMap(fromKey, toKey)
            .forAllMembers((destinationObject: any,
                            destinationPropertyName: string,
                            value: any): void => {
                destinationObject[destinationPropertyName] = value + suffix;
            });

        // act
        var destination = automapper.map(fromKey, toKey, source);

        // assert
        expect(destination.prop1).to.be.equal(source.prop1 + suffix);
        expect(destination.prop2).to.be.equal(source.prop2 + suffix);
    });

    it('should accept multiple forMember calls for the same destination property and overwrite with the last one specified', () => {
        //arrange
        var objA = {prop1: 'From A', prop2: 'From A too'};

        var fromKey = '{7AC4134B-ECC1-464B-B144-5B9D8F5B568E}';
        var toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CC665837}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop2');
            })
            .forMember('prop1', (opts: IMemberConfigurationOptions) => {
                opts.ignore();
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop1: objA.prop1});
    });

    it('should accept multiple forMember calls for the same destination property and overwrite with the last one specified in any order', () => {
        //arrange
        var objA = {prop1: 'From A', prop2: 'From A too'};

        var fromKey = '{7AC4134B-ECC1-464B-B144-5B9D8F5B568E}';
        var toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CC665837} in any order';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions) => {
                opts.ignore();
            })
            .forMember('prop1', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop2');
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop1: objA.prop1});
    });

    it('should be able to ignore a source property using the forSourceMember function', () => {
        // arrange
        var objA = {prop1: 'From A', prop2: 'From A too'};

        var fromKey = '{AD88481E-597B-4C1B-967B-3D700B8BAB0F}';
        var toKey = '{2A6714C4-784E-47D3-BBF4-6205834EC8D5}';

        automapper
            .createMap(fromKey, toKey)
            .forSourceMember('prop1', (opts: ISourceMemberConfigurationOptions) => {
                opts.ignore();
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop2: 'From A too'});
    });

    it('should be able to custom map a source property using the forSourceMember function', () => {
        // arrange
        var objA = {prop1: 'From A', prop2: 'From A too'};

        var fromKey = '{AD88481E-597B-4C1B-967B-3D700B8BAB0F}';
        var toKey = '{2A6714C4-784E-47D3-BBF4-6205834EC8D5}';

        automapper
            .createMap(fromKey, toKey)
            .forSourceMember('prop1', (opts: ISourceMemberConfigurationOptions) => {
                return 'Yeah!';
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop1: 'Yeah!', prop2: 'From A too'});
    });

    it('should be able to ignore a source property already specified (by forMember) using the forSourceMember function', () => {
        // arrange
        var objA = {prop1: 'From A', prop2: 'From A too'};

        var fromKey = '{AD88481E-597B-4C1B-967B-3D701B8CAB0A}';
        var toKey = '{2A6714C4-784E-47D3-BBF4-620583DEC86A}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', 12)
            .forSourceMember('prop1', (opts: ISourceMemberConfigurationOptions) => {
                opts.ignore();
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop2: 'From A too'});
    });

    it('should fail when forSourceMember is used with anything else than a function', () => {
        // arrange
        var caught = false;

        var fromKey = '{5EE20DF9-84B3-4A6A-8C5D-37AEDC44BE87}';
        var toKey = '{986C959D-2E2E-41FA-9857-8EF519467AEB}';

        try {
            // act
            automapper
                .createMap(fromKey, toKey)
                .forSourceMember('prop1', <any>12);
        } catch (e) {
            // assert
            caught = true;
            expect(e.message).to.be.equal('Configuration of forSourceMember has to be a function with one (sync) or two (async) options parameters.');
        }

        if (!caught) {
            // assert
            //expect().fail('Using anything else than a function with forSourceMember should result in an error.');
        }
    });

    it('should be able to use forMember to map a source property to a destination property with a different name', () => {
        //arrange
        var objA = {prop1: 'From A', prop2: 'From A too'};

        var fromKey = '{7AC4134B-ECC1-464B-B144-5B9D8F5B568E}';
        var toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CC665837}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop2');
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop1: objA.prop1, prop: objA.prop2});
    });

    it('should be able to use forMember to do custom mapping using lambda function', () => {
        //arrange
        var objA = {prop1: 'From A', prop2: 'From A too'};

        var fromKey = '{7AC4134B-ECC1-464B-B144-5B9D8F5B578E}';
        var toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CC665737}';

        const mapFromNullable = (opts: IMemberConfigurationOptions, field: string) => {
            if (opts.sourceObject[field]) {
                return opts.sourceObject[field];
            }
            return '';
        };

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => mapFromNullable(opts, 'prop2'));

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop1: objA.prop1, prop: objA.prop2});
    });

    it('should use forAllMembers function for each mapped destination property when specified', () => {
        // arrange
        var objA = {prop1: 'From A', prop2: 'From A too'};

        var fromKey = '{C4056539-FA86-4398-A10B-C41D3A791F26}';
        var toKey = '{01C64E8D-CDB5-4307-9011-0C7F1E70D115}';
        const forAllMembersFunc = (destinationObject: any, destinationProperty: string, value: any): void => {
                destinationObject[destinationProperty] = value;
        };
        var mockForAllMembers = Mock.ofInstance(forAllMembersFunc);
        mockForAllMembers.setup(x => x(It.isAny(), It.isAny(), It.isAny())).returns( (destinationObject: any, destinationProperty: string, value: any) => {
            return forAllMembersFunc(destinationObject, destinationProperty, value);
        });

        automapper
            .createMap(fromKey, toKey)
            .forAllMembers(mockForAllMembers.object);

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        //mockForAllMembers.verify(x => x(It.isAny(), It.isAny(), It.isAny()), Times.atLeastOnce());
        mockForAllMembers.verify(x => x(It.isAny(), It.isAny(), It.isAny()), Times.exactly(Object.keys(objB).length));
    });

    it('should be able to use forMember with a constant value', () => {
        // arrange
        var objA = {prop: 1};

        var fromKey = '{54E67626-B877-4824-82E6-01E9F411B78F}';
        var toKey = '{2D7FDB88-97E9-45EF-A111-C9CC9C188227}';

        var constantResult = 2;

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', constantResult);

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.prop).to.be.equal(constantResult);
    });

    it('should be able to use forMember with a function returning a constant value', () => {
        // arrange
        var objA = {prop: 1};

        var fromKey = '{74C12B56-1DD1-4EA0-A640-D1F814971124}';
        var toKey = '{BBC617B8-26C8-42A0-A204-45CC77073355}';

        var constantResult = 3;

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', () => {
                return constantResult;
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.prop).to.be.equal(constantResult);
    });

    it('should be able to use forMember with a function using the source object', () => {
        // arrange
        var objA = {prop: {subProp: {value: 1}}};

        var fromKey = '{54E67626-B877-4824-82E6-01E9F411B78F}';
        var toKey = '{2D7FDB88-97E9-45EF-A111-C9CC9C188227}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => {
                return opts.sourceObject[opts.sourcePropertyName].subProp.value * 2;
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.prop).to.be.equal(objA.prop.subProp.value * 2);
    });

    it('should be able to use forMember to ignore a property', () => {
        // arrange
        var objA = {prop: 1};

        var fromKey = '{76D26B33-888A-4DF7-ABDA-E5B99E944272}';
        var toKey = '{18192391-85FF-4729-9A08-5954FCFE3954}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => {
                opts.ignore();
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.hasOwnProperty('prop')).not.to.be.true;
    });

    it('should be able to use forMember to map a source property to a destination property with a different name', () => {
        // arrange
        var objA = {propDiff: 1};

        var fromKey = '{A317A36A-AD92-4346-A015-AE06FC862DB4}';
        var toKey = '{03B05E43-3028-44FD-909F-652E2DA5E607}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('propDiff');
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.prop).to.be.equal(objA.propDiff);
    });

    it('should be able to use stack forMember calls to map a source property to a destination property using multiple mapping steps', () => {
        // arrange
        var birthdayString = '2000-01-01T00:00:00.000Z';
        var objA = {birthdayString: birthdayString};

        var fromKey = '{564F1F57-FD4F-413C-A9D3-4B1C1333A20B}';
        var toKey = '{F9F45923-2D13-4EF1-9685-4883AD1D2F98}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('birthday', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('birthdayString');
            })
            .forMember('birthday', (opts: IMemberConfigurationOptions) => {
                return new Date(opts.intermediatePropertyValue);
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.birthday instanceof Date).to.be.true;
        expect(objB.birthday.toISOString()).to.be.equal('2000-01-01T00:00:00.000Z');
    });

    it('should be able to use stack forMember calls to map a source property to a destination property using multiple mapping steps in any order', () => {
        // arrange
        var birthdayString = '2000-01-01T00:00:00.000Z';
        var objA = {birthdayString: birthdayString};

        var fromKey = '{1609A9B5-6083-448B-8FD6-51DAD106B63D}';
        var toKey = '{47AF7D2D-A848-4C5B-904F-39402E2DCDD5}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('birthday', (opts: IMemberConfigurationOptions) => {
                return new Date(opts.intermediatePropertyValue);
            })
            .forMember('birthday', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('birthdayString');
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.birthday instanceof Date).to.be.true;
        expect(objB.birthday.toISOString()).to.be.equal('2000-01-01T00:00:00.000Z');
    });

    it('should not map properties that are not an object\'s own properties', () => {
        var objA = new ClassA();
        objA.propA = 'propA';

        var fromKey = '{A317A36A-AD92-4346-A015-AE06FC862DB4}';
        var toKey = '{03B05E43-3028-44FD-909F-652E2DA5E607}';

        automapper
            .createMap(fromKey, toKey);

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.propA).to.be.equal(objA.propA);
    });

    it('should be able to use convertUsing to map an object with a custom type resolver function', () => {
        var objA = {propA: 'propA'};

        var fromKey = '{D1534A0F-6120-475E-B7E2-BF2489C58571}';
        var toKey = '{1896FF99-1A28-4FE6-800B-072D5616B02D}';

        automapper
            .createMap(fromKey, toKey)
            .convertUsing(function (resolutionContext: IResolutionContext): any {
                return {propA: resolutionContext.sourceValue.propA + ' (custom mapped with resolution context)'};
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.propA).to.be.equal(objA.propA + ' (custom mapped with resolution context)');
    });

    it('should be able to use convertUsing to map an object with a custom type resolver class', () => {
        // arrange
        var objA = {propA: 'propA'};

        var fromKey = '{6E7F5757-1E55-4B55-BB86-44FF5B33DE2F}';
        var toKey = '{8521AE41-C3AF-4FCD-B7C7-A915C037D69E}';

        automapper
            .createMap(fromKey, toKey)
            .convertUsing(CustomTypeConverterDefinition);

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.propA).to.be.equal(objA.propA + ' (convertUsing with a class definition)');
    });

    it('should be able to use convertUsing to map an object with a custom type resolver instance', () => {
        // arrange
        // NOTE BL The CustomTypeConverter class definition is defined at the bottom, since TypeScript
        //         does not allow classes to be defined inline.

        var objA = {propA: 'propA'};

        var fromKey = '{BDF3758C-B38E-4343-95B6-AE0F80C8B9C4}';
        var toKey = '{13DD7AE1-4177-4A80-933B-B60A55859E50}';

        automapper
            .createMap(fromKey, toKey)
            .convertUsing(new CustomTypeConverterInstance());

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.propA).to.be.equal(objA.propA + ' (convertUsing with a class instance)');
    });

    it('should fail when directly using the type converter base class', () => {
        // arrange
        var caught = false;
        var objA = {propA: 'propA'};

        var fromKey = 'should fail when directly using ';
        var toKey = 'the type converter base class';

        automapper
            .createMap(fromKey, toKey)
            .convertUsing(TypeConverter);

        try {
            // act
            var objB = automapper.map(fromKey, toKey, objA);
        } catch (e) {
            // assert
            caught = true;
            expect(e.message).to.be.equal('The TypeConverter.convert method is abstract. Use a TypeConverter extension class instead.');
        }

        if (!caught) {
            // assert
            //expect().fail('Using the type converter base class directly should fail.');
        }
    });

    it('should fail when convertUsing is used with a function not having exactly one (resolutionContext) parameter.', () => {
        // arrange
        var caught = false;

        var fromKey = '{1EF9AC11-BAA1-48DB-9C96-9DFC40E33BCA}';
        var toKey = '{C4DA81D3-9072-4140-BFA7-431C35C01F54}';

        try {
            // act
            automapper
                .createMap(fromKey, toKey)
                .convertUsing(() => {
                    return {};
                });

            //var objB = automapper.map(fromKey, toKey, objA);
        } catch (e) {
            // assert
            caught = true;
            expect(e.message).to.be.equal('The value provided for typeConverterClassOrFunction is invalid. ' +
                'Error: The function provided does not provide exactly one (resolutionContext) parameter.');
        }

        if (!caught) {
            // assert
            //expect().fail('Using anything else than a function with forSourceMember should result in an error.');
        }
    });

    it('should be able to use convertToType to map a source object to a destination object which is an instance of a given class', () => {
        //arrange
        var objA = {ApiProperty: 'From A'};


        var fromKey = '{7AC4134B-ECC1-464B-B144-5C9D8F5B5A7E}';
        var toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CA6C4737}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('property', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('ApiProperty');
            })
            .convertToType(DemoToBusinessType);

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB instanceof DemoToBusinessType).to.be.true;
        expect(objB.property).to.be.equal(objA.ApiProperty);
    });

    it('should be able to use convertToType to map a source object to a destination object with default values defined', () => {
        //arrange
        var objA = {propA: 'another value'};

        var fromKey = '{7AC4134B-ECC1-464B-B144-5C9D8F5B5A7E}';
        var toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CA6C4737}';

        automapper
            .createMap(fromKey, toKey)
            .convertToType(ClassWithDefaultValues);

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB instanceof ClassWithDefaultValues).to.be.true;
        expect(objB.propA).to.be.equal(objA.propA);
    });

    it('should be able to use a condition to map or ignore a property', () => {
        // arrange
        var objA = {prop: 1, prop2: 2};

        var fromKey = '{76D23B33-888A-4DF7-BEBE-E5B99E944272}';
        var toKey = '{18192191-85FE-4729-A980-5954FCFE3954}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => {
                opts.condition((sourceObject: any) => sourceObject.prop === 0);
            })
            .forMember('prop2', (opts: IMemberConfigurationOptions) => {
                opts.condition((sourceObject: any) => sourceObject.prop2 === 2);
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.hasOwnProperty('prop')).not.to.be.true;
        expect(objB.hasOwnProperty('prop2')).to.be.true;
    });

    it('should be able to ignore all unmapped members using the ignoreAllNonExisting function', () => {
        // arrange
        var objA = {
            propA: 'Prop A',
            propB: 'Prop B',
            propC: 'Prop C',
            propD: 'Prop D'
        };

        var fromKey = '{AD88481E-597B-4C1C-9A7B-3D70DB8BCB0F}';
        var toKey = '{2A6614C4-784E-47D3-BBF4-6205834EA8D1}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('propA', (opts: IMemberConfigurationOptions) => opts.mapFrom('propA'))
            .ignoreAllNonExisting();

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({propA: 'Prop A'});
    });

    it('should be able to create a map and use it using class types', () => {
        // arrange
        var objA = new ClassA();
        objA.propA = 'Value';

        // act
        automapper.createMap(ClassA, ClassB);
        var objB = automapper.map(ClassA, ClassB, objA);

        // assert
        expect(objB instanceof ClassB).to.be.true;
        expect(objB).to.be.deep.equal({propA: 'Value'});
    });

    it('should throw an error when creating a map using class types and specifying a conflicting destination type', () => {
        // arrange
        var caught = false;

        // act
        try {
            automapper
                .createMap(ClassA, ClassB)
                .convertToType(ClassC);
        } catch (e) {
            caught = true;
            // assert
            expect(e.message).to.be.equal('Destination type class can only be set once.');
        }

        if (!caught) {
            // assert
            //expect(null).fail('AutoMapper should throw an error when creating a map using class types and specifying a conflicting destination type.');
        }
    });

    it('should be able to use forMember to map a nested source property to a destination property', () => {
        //arrange
        var objA = {prop1: {propProp1: 'From A'}, prop2: 'From A too'};

        var fromKey = '{7AC4134B-ECC1-464B-B144-5B9D8F5B568E}';
        var toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CC665837}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop1.propProp1');
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop2: objA.prop2, propFromNestedSource: objA.prop1.propProp1});
    });

    it('should be able to stack forMember calls when mapping a nested source property to a destination property', () => {
        //arrange
        var objA = {prop1: {propProp1: 'From A'}, prop2: 'From A too'};
        var addition = ' - sure works!';

        var fromKey = '{7AC4134B-ECC1-464B-B144-5B99CF5B558E}';
        var toKey = '{2BDE907C-1CE6-4CC5-56A1-9A94CC6658C7}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop1.propProp1');
            })
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => {
                return opts.intermediatePropertyValue + addition;
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop2: objA.prop2, propFromNestedSource: objA.prop1.propProp1 + addition});
    });

    it('should be able to stack forMember calls when mapping a nested source property to a destination property in any order', () => {
        //arrange
        var objA = {prop1: {propProp1: 'From A'}, prop2: 'From A too'};
        var addition = ' - sure works!';

        var fromKey = '{7AC4134B-ECD1-46EB-B14A-5B9D8F5B5F8E}';
        var toKey = '{BBD6907C-ACE6-4FC8-A60D-1A943C66D83F}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => {
                return opts.intermediatePropertyValue + addition;
            })
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop1.propProp1');
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop2: objA.prop2, propFromNestedSource: objA.prop1.propProp1 + addition});
    });

    it('should be able to stack forMember mapFrom calls when mapping a nested source property to a destination property', () => {
        //arrange
        var objA = {prop1: {propProp1: 'From A', propProp2: {propProp2Prop: 'From A'}}, prop2: 'From A too'};
        var addition = ' - sure works!';

        var fromKey = '{7AC4134B-ECD1-46EB-B14A-5B9D8F5B5F8E}';
        var toKey = '{BBD6907C-ACE6-4FC8-A60D-1A943C66D83F}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => {
                return opts.intermediatePropertyValue + addition;
            })
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop1.propProp2.propProp2Prop');
            })
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop1.propProp1');
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop2: objA.prop2, propFromNestedSource: objA.prop1.propProp1 + addition});
    });

    it('should be able to use forMember to map to a nested destination', () => {
        //arrange
        var objA = {
            prop1: {propProp1: 'From A', propProp2: {propProp2Prop: 'From A'}},
            prop2: 'From A too'
        };
        var addition = ' - sure works!';

        var fromKey = '{7AC4134B-ECD1-46EB-B14A-5B9D8F5B5F8E}';
        var toKey = '{BBD6907C-ACE6-4FC8-A60D-1A943C66D83F}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('nested.property', (opts: IMemberConfigurationOptions) => {
                return opts.intermediatePropertyValue + addition;
            })
            .forMember('nested.property', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop1.propProp2.propProp2Prop');
            })
            .forMember('nested.property', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop1.propProp1');
            });

        // act
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop2: objA.prop2, nested: {property: objA.prop1.propProp1 + addition}});
    });

    it('should be able to use mapFrom to switch properties and ignore a property as well', () => {
        // arrange
        var objA = {prop1: 'From A', prop2: 'From A too', prop3: 'Also from A (really)'};

        var fromKey = 'should be able to use mapFrom to switch ';
        var toKey = 'properties and ignore a property as well';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop2');
            })
            .forMember('prop2', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop1');
            })
            .forSourceMember('prop3', (opts: ISourceMemberConfigurationOptions) => {
                opts.ignore();
            });

        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop1: objA.prop2, prop2: objA.prop1});
    });

    it('should be able to create a new property using a constant value', () => {
        // arrange
        var objA = {};

        var fromKey = 'should be able to create a new property ';
        var toKey = 'using a constant value';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop4', (opts: IMemberConfigurationOptions) => {
                return 12;
            });

        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop4: 12});
    });

    it('should just return source object when no properties are created using null source object', () => {
        // arrange
        var objA: any = null;

        var fromKey = 'should just return source object when no ';
        var toKey = 'properties created using null source object';

        // act
        automapper
            .createMap(fromKey, toKey);

        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.null;
    });

    it('should be able to create a new property using a constant value (empty source object)', () => {
        // arrange
        var objA: any = {};

        var fromKey = 'should be able to create a new property ';
        var toKey = 'using a constant value (empty source object)';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop4', (opts: IMemberConfigurationOptions) => {
                return 12;
            });

        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop4: 12});
    });

    it('should map a source object with empty nested objects', () => {
        // arrange
        var src: any = {
            // homeAddress: undefined,
            // homeAddress: null,
            businessAddress: {
                address1: '200 Main St',
                // address2: '200 Main St',
                city: 'Los Angeles',
                state: 'CA',
                zip: '90000'
            }
        };

        var fromKey = '{60E9DC56-D6E1-48FF-9BAC-0805FCAF91B7}';
        var toKey = '{AC6D5A97-9AEF-42C7-BD60-A5F3D17E541A}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('homeAddress.address2', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('homeAddress.address2');
            })

            .forMember('businessAddress.address1', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('businessAddress.address1');
            })
            .forMember('businessAddress.address2', (opts: IMemberConfigurationOptions) => <any>null)
            .forMember('businessAddress.city', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('businessAddress.city');
            })
            .forMember('businessAddress.state', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('businessAddress.state');
            })
            .forMember('businessAddress.zip', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('businessAddress.zip');
            })
        ;

        // act
        var dst = automapper.map(fromKey, toKey, src);

        // assert
        expect(dst).to.be.not.null;

        expect(dst.homeAddress).to.be.undefined;

        expect(dst.businessAddress.address1).to.be.equal(src.businessAddress.address1);
        expect(dst.businessAddress.address2).to.be.null;
        expect(dst.businessAddress.city).to.be.equal(src.businessAddress.city);
        expect(dst.businessAddress.state).to.be.equal(src.businessAddress.state);
        expect(dst.businessAddress.zip).to.be.equal(src.businessAddress.zip);
    });

    it('should be able to use mapFrom to map from property which is ignored itself on destination', () => {
        // arrange
        var objA = {prop1: 'From A', prop2: 'From A too', prop3: 'Also from A (really)'};

        var fromKey = 'should be able to use mapFrom to map from ';
        var toKey = 'property which is ignored itself on destination';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions) => {
                opts.mapFrom('prop2');
            })
            .forMember('prop2', (opts: IMemberConfigurationOptions) => {
                opts.ignore();
            }) // changing 'prop2' to e.g. 'destProp2' everything works correctly.
            .forSourceMember('prop3', (opts: ISourceMemberConfigurationOptions) => {
                opts.ignore();
            })
            .forMember('prop4', () => {
                return 12;
            });

        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop1: objA.prop2, prop4: 12});
    });

    it('should be able to use forMember and use opts.sourceObject', () => {
        // arrange
        var objA = {prop1: 'prop1', prop2: 'prop2'};

        var fromKey = 'should be able to use forMember ';
        var toKey = 'and access opts.sourceObject' + postfix;

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions) => opts.sourceObject)
            .forMember('prop2', (opts: IMemberConfigurationOptions) => opts.sourceObject['prop1']);

        // assert
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop1: objA, prop2: objA.prop1});
    });

    it('should be able to use forMember and use opts.intermediatePropertyValue', () => {
        // arrange
        var objA = {prop1: 1};

        var fromKey = 'should be able to use forMember ';
        var toKey = 'and access opts.intermediatePropertyValue' + postfix;

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => opts.mapFrom('prop1'))
            .forMember('prop', (opts: IMemberConfigurationOptions) => !!opts.intermediatePropertyValue);

        // assert
        var objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).to.be.deep.equal({prop: true});
    });

    //     // TODO expand AutoMapperBase.handleItem to also handle nested properties (not particularly hard to do anymore, but still requires quite a bit of work)
    //     it('should map a source object with nested objects using mapping functions and automapping at the same time', () => {
    //         // arrange
    //         var src: any = {
    //             businessAddress: {
    //                 address1: '200 Main St',
    //                 city: 'Los Angeles',
    //                 state: 'CA',
    //                 zip: '90000'
    //             }
    //         };

    //         var fromKey = '{60E9DC56-D6E1-48FF-9BAC-0805FCAF91B7}';
    //         var toKey = '{AC6D5A97-9AEF-42C7-BD60-A5F3D17E541A}';

    //         automapper
    //             .createMap(fromKey, toKey)
    //             .forMember('businessAddress.address2', (opts: IMemberConfigurationOptions) => <any>null);
    //         // the forMember call currently fails the test. Automapping on nested properties is currently
    //         // not implemented when a forMember call is present! Should work somewhat like the handleItem
    //         // function at 'root level'.

    //         // act
    //         var dst = automapper.map(fromKey, toKey, src);

    //         // assert
    //         expect(dst).to.be.not.null;

    //         expect(dst.homeAddress).to.be.equalUndefined();
    //         console.log(dst);
    //         expect(dst.businessAddress.address1).to.be.equal(src.businessAddress.address1);
    //         expect(dst.businessAddress.address2).to.be.equalUndefined();
    //         expect(dst.businessAddress.city).to.be.equal(src.businessAddress.city);
    //         expect(dst.businessAddress.state).to.be.equal(src.businessAddress.state);
    //         expect(dst.businessAddress.zip).to.be.equal(src.businessAddress.zip);
    //     });
});

class ClassA {
    public propA: string | null = null;
}

class ClassB {
    public propA: string | null = null;
}

//Initialization of property necessary to force Javascript create this property on class
class ClassC {
    public propA: string | null = null;
}

class ClassWithDefaultValues {
    public propA: string = 'default value';
}

class DemoToBusinessType {
}

class CustomTypeConverterInstance extends TypeConverter {
    public convert(resolutionContext: IResolutionContext): any {
        return {propA: resolutionContext.sourceValue.propA + ' (convertUsing with a class instance)'};
    }
}

class CustomTypeConverterDefinition extends TypeConverter {
    public convert(resolutionContext: IResolutionContext): any {
        return {propA: resolutionContext.sourceValue.propA + ' (convertUsing with a class definition)'};
    }
}


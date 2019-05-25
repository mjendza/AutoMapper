import {IMemberCallback, IMemberConfigurationOptions, ISourceMemberConfigurationOptions} from '../../../src/ts/contracts';
import automapper from '../../../src/ts/AutoMapper';
import {expect} from 'chai';
import {AsyncAutoMapper} from '../../../dist/AsyncAutoMapper';

describe('AutoMapper - Currying support', () => {

    it('should be able to use currying when calling createMap', () => {
        // arrange
        var fromKey = '{808D9D7F-AA89-4D07-917E-A528F055EE64}';
        var toKey1 = '{B364C0A0-9E24-4424-A569-A4C14101947C}';
        var toKey2 = '{1055CA5A-4FC4-44CB-B4D8-B004F43D8840}';

        var source = {prop: 'Value'};

        // act
        var mapFromKeyCurry = automapper.createMap(fromKey);

        mapFromKeyCurry
            .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions) => {
                opts.ignore();
            });

        //mapFromKeyCurry;

        var result1 = automapper.map(fromKey, toKey1, source);
        var result2 = automapper.map(fromKey, toKey2, source);

        // assert
        expect(typeof mapFromKeyCurry === 'function').to.be.true;
        expect(result1.prop).to.be.undefined;
        expect(result2.prop).to.be.equal(source.prop);
    });

    it('should be able to use currying (one parameter) when calling map', () => {
        // arrange
        var fromKey = 'should be able to use currying (one parameter)';
        var toKey1 = 'when calling map (1)';
        var toKey2 = 'when calling map (2)';

        var source = {prop: 'Value'};

        // act
        var createMapFromKeyCurry = automapper.createMap(fromKey);

        createMapFromKeyCurry(toKey1)
            .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions) => {
                opts.ignore();
            });

        createMapFromKeyCurry(toKey2);

        var result1MapCurry = automapper.map(fromKey);
        var result2MapCurry = automapper.map(fromKey);

        var result1 = result1MapCurry(toKey1, source);
        var result2 = result2MapCurry(toKey2, source);

        // assert
        expect(typeof createMapFromKeyCurry === 'function').to.be.true;
        expect(typeof result1MapCurry === 'function').to.be.true;
        expect(typeof result2MapCurry === 'function').to.be.true;

        expect(result1.prop).to.be.undefined;
        expect(result2.prop).to.be.equal(source.prop);
    });

    it('should be able to use currying when calling map', () => {
        // arrange
        var fromKey = '{FC18523B-5A7C-4193-B938-B6AA2EABB37A}';
        var toKey1 = '{609202F4-15F7-4512-9178-CFAF073800E1}';
        var toKey2 = '{85096AE2-92FB-43D7-8FC3-EC14DDC1DFDD}';

        var source = {prop: 'Value'};

        // act
        var createMapFromKeyCurry = automapper.createMap(fromKey);

        createMapFromKeyCurry
            .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions) => {
                opts.ignore();
            });

        //createMapFromKeyCurry(toKey2);

        var result1MapCurry = automapper.map(fromKey, toKey1);
        var result2MapCurry = automapper.map(fromKey, toKey2);

        var result1 = result1MapCurry(source);
        var result2 = result2MapCurry(source);

        // assert
        expect(typeof createMapFromKeyCurry === 'function').to.be.true;
        expect(typeof result1MapCurry === 'function').to.be.true;
        expect(typeof result2MapCurry === 'function').to.be.true;

        expect(result1.prop).to.be.undefined;
        expect(result2.prop).to.be.equal(source.prop);
    });

    it('should be able to use currying when calling mapAsync', (done: () => void) => {
        // arrange
        var fromKey = '{1CA8523C-5A7C-4193-B938-B6AA2EABB37A}';
        var toKey1 = '{409212FD-15E7-4512-9178-CFAF073800EG}';
        var toKey2 = '{85096AE2-92FA-43N7-8FA3-EC14DDC1DFDE}';

        var source = {prop: 'Value'};

        // act
        var createMapFromKeyCurry = automapper.createMap(fromKey);

        createMapFromKeyCurry
            .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions, cb: IMemberCallback) => {
                cb('Constant Value 1');
            });

        createMapFromKeyCurry
            .forMember('prop', (opts: IMemberConfigurationOptions, cb: IMemberCallback) => {
                cb('Constant Value 2');
            });

        var result1MapCurry = automapper.mapAsync(fromKey, toKey1);
        var result2MapCurry = automapper.mapAsync(fromKey, toKey2);

        // assert
        expect(typeof createMapFromKeyCurry === 'function').to.be.true;
        expect(typeof result1MapCurry === 'function').to.be.true;
        expect(typeof result2MapCurry === 'function').to.be.true;

        var resCount = 0;
        var result1 = result1MapCurry(source, (result: any) => {
            // assert
            expect(result.prop).to.be.equal('Constant Value 1');
            if (++resCount === 2) {
                done();
            }
        });

        var result2 = result2MapCurry(source, (result: any) => {
            // assert
            expect(result.prop).to.be.equal('Constant Value 2');
            if (++resCount === 2) {
                done();
            }
        });
    });

    it('should be able to use currying when calling mapAsync with one parameter', (done: () => void) => {
        // arrange
        var fromKey = '{1CA8523C-5AVC-4193-BS38-B6AA2EABB37A}';
        var toKey = '{409212FD-1527-4512-9178-CFAG073800EG}';

        var source = {prop: 'Value'};

        // act
        automapper.createMap(fromKey, toKey)
            .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions, cb: IMemberCallback) => {
                cb('Constant Value');
            });

        var mapAsyncCurry = automapper.mapAsync(fromKey);

        // assert
        expect(typeof mapAsyncCurry === 'function').to.be.true;

        var result = mapAsyncCurry(toKey, source, (result: any) => {
            // assert
            expect(result.prop).to.be.equal('Constant Value');
            done();
        });
    });

    it('should be able to use currying when calling mapAsync with two parameters', (done: () => void) => {
        // arrange
        var fromKey = '{1CA852SC-5AVC-4193-BS38-B6AA2KABB3LA}';
        var toKey = '{409212FD-1Q27-45G2-9178-CFAG073800EG}';

        var source = {prop: 'Value'};

        // act
        automapper.createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions, cb: IMemberCallback) => {
                cb('Constant Value');
            });

        var mapAsyncCurry = automapper.mapAsync(fromKey, toKey);

        // assert
        expect(typeof mapAsyncCurry === 'function').to.be.true;

        var result = mapAsyncCurry(source, (result: any) => {
            // assert
            expect(result.prop).to.be.equal('Constant Value');
            done();
        });
    });

    it('should be able to use currying when calling mapAsync with three parameters', (done: () => void) => {
        // NOTE BL 20151214 I wonder why anyone would like calling this one? Maybe this one will be removed in
        //                  the future. Please get in touch if you need this one to stay in place...

        // arrange
        var fromKey = '{1CA852SC-5AVC-ZZ93-BS38-B6AA2KABB3LA}';
        var toKey = '{409212FD-1Q27-45G2-91BB-CFAG0738WCEG}';

        var source = {prop: 'Value'};

        // act
        automapper.createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions, cb: IMemberCallback) => {
                cb('Constant Value');
            });

        var mapAsyncCurry = automapper.mapAsync(fromKey, toKey, source);

        // assert
        expect(typeof mapAsyncCurry === 'function').to.be.true;

        var result = mapAsyncCurry((result: any) => {
            // assert
            expect(result.prop).to.be.equal('Constant Value');
            done();
        });
    });

    it('should fail when calling mapAsync without parameters', () => {
        // arrange

        // act
        try {
            var mapAsyncCurry = (<any>automapper).mapAsync();
        } catch (e) {
            // assert
            expect(e.message).to.be.equal('The mapAsync function expects between 1 and 4 parameters, you provided 0.');
            return;
        }

        // assert
        //expect(null).fail('Expected error was not raised.');
    });

    it('should fail when calling mapAsync with > 4 parameters', () => {
        // arrange

        // act
        try {
            var mapAsyncCurry = (<any>automapper).mapAsync(undefined, undefined, undefined, undefined, undefined);
        } catch (e) {
            // assert
            expect(e.message).to.be.equal('The mapAsync function expects between 1 and 4 parameters, you provided 5.');
            return;
        }

        // assert
        //expect(null).fail('Expected error was not raised.');
    });


    it('should fail when specifying < 2 parameters to the asynchronous map function', () => {
        // arrange

        // act
        try {
            (<any>new AsyncAutoMapper()).map(undefined);
        } catch (e) {
            // assert
            expect(e.message).to.be.equal('The AsyncAutoMapper.map function expects between 2 and 5 parameters, you provided 1.');
            return;
        }

        // assert
        //expect(null).fail('Expected error was not raised.');
    });

    it('should fail when specifying > 5 parameters to the asynchronous map function', () => {
        // arrange

        // act
        try {
            (<any>new AsyncAutoMapper()).map(undefined, undefined, undefined, undefined, undefined, undefined);
        } catch (e) {
            // assert
            expect(e.message).to.be.equal('The AsyncAutoMapper.map function expects between 2 and 5 parameters, you provided 6.');
            return;
        }

        // assert
        //expect(null).fail('Expected error was not raised.');
    });
});


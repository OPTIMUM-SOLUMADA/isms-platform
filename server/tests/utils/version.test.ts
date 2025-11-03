import { createVersion, parseVersion, bumpVersion, downgradeVersion } from '@/utils/version';

describe('Version utils', () => {
    it('should create version', () => {
        expect(createVersion(1, 2)).toEqual('1.2');
        expect(createVersion(1, 2)).toEqual('1.2');
    });

    it('should parse version', () => {
        expect(parseVersion('1.0')).toEqual([1, 0]);
        expect(parseVersion('1.2')).toEqual([1, 2]);
    });

    it('should bump version', () => {
        expect(bumpVersion('1.2', 'patch')).toEqual('1.3');
        expect(bumpVersion('1.2', 'major')).toEqual('2.0');
    });

    it('should downgrade version', () => {
        expect(downgradeVersion('1.1', 'patch')).toEqual('1.0');
        expect(downgradeVersion('3.2', 'major')).toEqual('2.0');
    });

    it('should not downgrade if version is 1.0', () => {
        expect(() => downgradeVersion('1.0', 'patch')).toThrow('Cannot downgrade below 1.0');
        expect(() => downgradeVersion('1.7', 'major')).toThrow('Cannot downgrade below 1.0');
    });
});

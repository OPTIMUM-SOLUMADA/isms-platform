import { parseVersion } from 'utils/version';

describe('Version utils', () => {
    it('should parse version', () => {
        expect(parseVersion('1.2.3')).toEqual([1, 2, 3]);
    });
});

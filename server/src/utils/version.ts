/**
 * Parse version "x.z" into [major, patch]
 */
export function parseVersion(version: string): [number, number] {
    if (!/^\d+\.\d+$/.test(version)) {
        throw new Error(`Invalid version format: ${version}. Expected "x.z"`);
    }

    const [major = 0, patch = 0] = version.split('.').map(Number);
    return [major, patch];
}

/**
 * Create version "x.z"
 */
export function createVersion(major: number, patch: number): string {
    return `${major}.${patch}`;
}

/**
 * Increment version
 */
export function bumpVersion(version: string, type: 'major' | 'patch' = 'patch'): string {
    let [major, patch] = parseVersion(version);

    if (type === 'major') {
        major += 1;
        patch = 0;
    } else {
        patch += 1;
    }

    return createVersion(major, patch);
}

/**
 * Decrement version
 */
export function downgradeVersion(version: string, type: 'major' | 'patch' = 'patch'): string {
    let [major, patch] = parseVersion(version);

    if (type === 'major') {
        if (major === 1) throw new Error('Cannot downgrade below 1.0');
        major -= 1;
        patch = 0;
    } else {
        if (patch === 0) {
            if (major === 1) throw new Error('Cannot downgrade below 1.0');
            major -= 1;
            patch = 0;
        } else {
            patch -= 1;
        }
    }

    return createVersion(major, patch);
}

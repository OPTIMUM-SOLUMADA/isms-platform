/**
 * Parse version "x.y" or "x.y.z" into [major, minor, patch]
 */
export function parseVersion(version: string): [number, number, number] {
    if (!/^\d+(\.\d+){1,2}$/.test(version)) {
        throw new Error(`Invalid version format: ${version}. Expected "x.y" or "x.y.z"`);
    }

    const parts = version.split('.').map(Number);
    while (parts.length < 3) parts.push(0); // ensure [major, minor, patch]
    return parts as [number, number, number];
}

/**
 * Format version numbers back into "x.y.z"
 */
export function formatVersion(major: number, minor: number, patch: number): string {
    return `${major}.${minor}.${patch}`;
}

/**
 * Increment version
 */
export function bumpVersion(version: string, type: 'major' | 'minor' | 'patch' = 'patch'): string {
    let [major, minor, patch] = parseVersion(version);

    if (type === 'major') {
        major += 1;
        minor = 0;
        patch = 0;
    } else if (type === 'minor') {
        minor += 1;
        patch = 0;
    } else {
        patch += 1;
    }

    return formatVersion(major, minor, patch);
}

/**
 * Decrement version
 */
export function downgradeVersion(
    version: string,
    type: 'major' | 'minor' | 'patch' = 'patch',
): string {
    let [major, minor, patch] = parseVersion(version);

    if (type === 'major') {
        if (major === 0) throw new Error('Cannot downgrade below 0.0.0');
        major -= 1;
        minor = 0;
        patch = 0;
    } else if (type === 'minor') {
        if (minor === 0) {
            if (major === 0) throw new Error('Cannot downgrade below 0.0.0');
            major -= 1;
            minor = 0;
            patch = 0;
        } else {
            minor -= 1;
            patch = 0;
        }
    } else {
        if (patch === 0) {
            if (minor > 0) {
                minor -= 1;
                patch = 0;
            } else if (major > 0) {
                major -= 1;
                minor = 0;
                patch = 0;
            } else {
                throw new Error('Cannot downgrade below 0.0.0');
            }
        } else {
            patch -= 1;
        }
    }

    return formatVersion(major, minor, patch);
}

// method to create version x.y or x.y.z
export function createVersion(major: number, minor: number, patch?: number): string {
    if (patch === undefined) return `${major}.${minor}`;
    return `${major}.${minor}.${patch}`;
}

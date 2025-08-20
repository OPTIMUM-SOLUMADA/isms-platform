/**
 * Generate deterministic HEX color from string
 */
export const generateHex = (name: string): string => {
    const hash = getHashOfString(name);

    // Create RGB components from hash
    const r = normalizeHash(hash, 50, 200); // avoid too dark/light
    const g = normalizeHash(hash >> 8, 50, 200);
    const b = normalizeHash(hash >> 16, 50, 200);

    // Convert to HEX string
    const toHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();

    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Example helper functions
 */
function getHashOfString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function normalizeHash(hash: number, min: number, max: number): number {
    const value = Math.abs(hash) % (max - min + 1) + min;
    return value;
}


export const generateAvatar = function (id: string, name: string) {
    const bgColor = generateHex(id);
    const fgColor = "FFF";
    return `https://ui-avatars.com/api/?name=${name}&background=${bgColor}&color=${fgColor}`
}
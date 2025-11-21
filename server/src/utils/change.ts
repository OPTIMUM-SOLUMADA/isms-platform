import { isEqual, isObject } from 'lodash';

export function getChanges(before: any, after: any) {
    // If completely equal, return nothing
    if (isEqual(before, after)) return {};

    // If both are objects, recurse on keys
    if (isObject(before) && isObject(after)) {
        const result: any = {};
        const keys = new Set([...Object.keys(before), ...Object.keys(after)]);

        for (const key of keys) {
            const b = (before as any)[key];
            const a = (after as any)[key];

            if (isEqual(b, a)) {
                continue;
            }

            // If both are arrays → do NOT recurse → return full array diff
            if (Array.isArray(b) && Array.isArray(a)) {
                result[key] = { before: b, after: a };
                continue;
            }

            // If both are objects, recurse
            if (isObject(b) && isObject(a)) {
                const diff = getChanges(b, a);
                if (Object.keys(diff).length > 0) {
                    result[key] = diff;
                }
            } else {
                // Otherwise, mark the change
                result[key] = { before: b, after: a };
            }
        }

        return result;
    }

    // Fallback: they differ
    return { before, after };
}

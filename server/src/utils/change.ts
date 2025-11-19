export function getChanges(before: any, after: any) {
    const changes: any = {};

    for (const key of Object.keys(after)) {
        if (before[key] !== after[key]) {
            changes[key] = {
                before: before[key],
                after: after[key],
            };
        }
    }

    return changes;
}

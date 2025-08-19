export const UsersStatusObject = {
    ACTIVE: true,
    INACTIVE: false
} as const;

export const userStatus = Object.keys(UsersStatusObject).map(v => v);
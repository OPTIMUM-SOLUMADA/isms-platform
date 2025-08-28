import { useUser } from '@/contexts/UserContext';
import React from 'react'

interface UserGroupProps {
    usersId: string[]
}
const UserGroup = ({
    usersId
}: UserGroupProps) => {
    const { } = useUser();
    return (
        <div className='w-full flex items-center gap-1'>

        </div>
    )
}

export default UserGroup
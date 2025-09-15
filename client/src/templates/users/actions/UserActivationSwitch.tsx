import * as React from 'react';
import { Switch } from "@/components/ui/switch";
import { User } from '@/types';
import { useUserUIStore } from '@/stores/user/useUserUIStore';
import { useTranslation } from 'react-i18next';

interface UserActivationSwitchProps {
    user: User;
    active: boolean;
}

export const UserActivationSwitch: React.FC<UserActivationSwitchProps> = ({
    active,
    user,
}) => {

    const { t } = useTranslation();

    const {
        openActivation,
        openDesactivation,
        setCurrentUser,
        closeActivation,
        closeDesactivation,
    } = useUserUIStore();

    const handleSwitchChange = (checked: boolean) => {
        setCurrentUser(user);
        if (checked) {
            openActivation();
            closeDesactivation();
        } else {
            openDesactivation();
            closeActivation();
        }
    };

    return (
        <div className='flex items-center gap-2'>
            <Switch checked={active} onCheckedChange={handleSwitchChange} />
            <span className='text-xs'>
                {active ? t("common.user.status.active") : t("common.user.status.inactive")}
            </span>
        </div>
    );
};

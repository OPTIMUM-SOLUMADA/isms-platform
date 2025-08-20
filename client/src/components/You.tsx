import { useTranslation } from 'react-i18next'

const You = () => {
    const { t } = useTranslation();
    return (
        <span>
            ({t("user.you.label")})
        </span>
    )
}

export default You
import { useTranslation } from "react-i18next"

const Required = () => {
    return (
        <span className='text-theme-danger text-sm'>*</span>
    )
}

export const RequiredIndicatorInfo = () => {
    const { t } = useTranslation();
    return (
        <span className='text-sm [&>span]:text-theme-danger'
            dangerouslySetInnerHTML={{
                __html: t("common.form.requiredIndicatorInfo")
            }}
        />
    )
}

export default Required
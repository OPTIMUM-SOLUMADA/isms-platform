import { useTranslation } from 'react-i18next'
import ErrorField from '@/components/ui/error-field';

interface ErrorCodeFieldProps {
    code?: string | null;
}
const ErrorCodeField = ({ code }: ErrorCodeFieldProps) => {
    const { t } = useTranslation();
    return code ? (
        <ErrorField value={t(`errors.${code}`)} />
    ) : null;
}

export default ErrorCodeField
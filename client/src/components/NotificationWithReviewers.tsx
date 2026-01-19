import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Reviewer {
  id: string;
  name: string;
}

interface NotificationMetadata {
  approvedReviewers?: Reviewer[];
  pendingReviewers?: Reviewer[];
  rejectedBy?: Reviewer[];
}

interface NotificationWithReviewersProps {
  type: string;
  metadata?: NotificationMetadata;
}

export function NotificationWithReviewers({ type, metadata }: NotificationWithReviewersProps) {
  const { t } = useTranslation();
  const [showApproved, setShowApproved] = useState(false);
  const [showPending, setShowPending] = useState(false);
  const [showRejected, setShowRejected] = useState(false);

  if (!metadata) return null;

  if (type === 'DOCUMENT_PARTIALLY_APPROVED') {
    const { approvedReviewers = [], pendingReviewers = [] } = metadata;

    return (
      <div className="mt-2 space-y-2 text-xs">
        {/* Approved reviewers dropdown */}
        {approvedReviewers.length > 0 && (
          <div className="border border-green-200 rounded-md bg-green-50 p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowApproved(!showApproved);
              }}
              className="flex items-center justify-between w-full text-green-700 font-medium hover:text-green-800"
            >
              <span>
                {t('notifications.templates.DOCUMENT_PARTIALLY_APPROVED.approvedBy')} ({approvedReviewers.length})
              </span>
              {showApproved ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {showApproved && (
              <ul className="mt-2 space-y-1 pl-2">
                {approvedReviewers.map((reviewer) => (
                  <li key={reviewer.id} className="text-green-600">
                    • {reviewer.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Pending reviewers dropdown */}
        {pendingReviewers.length > 0 && (
          <div className="border border-orange-200 rounded-md bg-orange-50 p-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPending(!showPending);
              }}
              className="flex items-center justify-between w-full text-orange-700 font-medium hover:text-orange-800"
            >
              <span>
                {t('notifications.templates.DOCUMENT_PARTIALLY_APPROVED.pendingReviewers')} ({pendingReviewers.length})
              </span>
              {showPending ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {showPending && (
              <ul className="mt-2 space-y-1 pl-2">
                {pendingReviewers.map((reviewer) => (
                  <li key={reviewer.id} className="text-orange-600">
                    • {reviewer.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }

  if (type === 'DOCUMENT_REJECTED') {
    const { rejectedBy = [] } = metadata;

    if (rejectedBy.length === 0) return null;

    return (
      <div className="mt-2 text-xs">
        <div className="border border-red-200 rounded-md bg-red-50 p-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowRejected(!showRejected);
            }}
            className="flex items-center justify-between w-full text-red-700 font-medium hover:text-red-800"
          >
            <span>
              {t('notifications.templates.DOCUMENT_REJECTED.rejectedBy')} ({rejectedBy.length})
            </span>
            {showRejected ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {showRejected && (
            <ul className="mt-2 space-y-1 pl-2">
              {rejectedBy.map((reviewer) => (
                <li key={reviewer.id} className="text-red-600">
                  • {reviewer.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return null;
}

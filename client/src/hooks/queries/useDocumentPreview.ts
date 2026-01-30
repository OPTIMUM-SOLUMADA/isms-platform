import { useQuery } from '@tanstack/react-query';
import axios from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentPreviewUrlResponse {
  previewUrl: string;
  downloadUrl: string;
  fileId: string;
  version: string;
}

/**
 * Hook to get secure preview URL for a document from backend
 * This solves the 403 error by using backend to generate proper Google Drive URLs
 * 
 * @param documentId - The document ID
 * @param versionId - Optional specific version ID (defaults to current version)
 * @param enabled - Whether to enable the query (default: true)
 */
export const useGetDocumentPreviewUrl = (
  documentId: string | undefined,
  versionId?: string,
  enabled: boolean = true
) => {
  const { user } = useAuth();

  return useQuery<DocumentPreviewUrlResponse>({
    queryKey: ['document-preview-url', documentId, versionId, user?.email],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (versionId) params.append('versionId', versionId);
      if (user?.email) params.append('userEmail', user.email);
      
      const queryString = params.toString();
      const url = `/documents/preview-url/${documentId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get<DocumentPreviewUrlResponse>(url);
      return response.data;
    },
    enabled: enabled && !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes - URLs are relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentService } from "@/services/documentService";
import type { Document, DocumentVersion, RecentlyViewedDocument } from "@/types";
import type { ApiAxiosError } from "@/types/api";
import { AddDocumentFormData } from "@/templates/documents/forms/AddDocumentForm";
import { EditDocumentFormData } from "@/templates/documents/forms/EditDocumentForm";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import useDocumentStore from "@/stores/document/useDocumentStore";
import { useAuth } from "@/contexts/AuthContext";
import { downloadBlob } from "@/lib/download";

// -----------------------------
// Fetch Documents
// -----------------------------
export const useFetchDocuments = () => {
  const { page, limit, setDocuments } = useDocumentStore();

  const query = useQuery<{ data: Document[]; total: number }, ApiAxiosError>({
    queryKey: ["documents", page, limit],
    queryFn: async () => (await documentService.list({ page, limit })).data,
    staleTime: 1000 * 60 * 2,
  });

  useEffect(() => {
    if (query.data) setDocuments(query.data.data);
  }, [query.data, setDocuments]);

  return query;
};

// -----------------------------
// Get Document by ID
// -----------------------------
export const useGetDocument = (id: string | undefined) => {
  return useQuery<Document, ApiAxiosError>({
    queryKey: ["documents", id],
    queryFn: async () => {
      if (!id) throw new Error("Document ID is required");
      const res = await documentService.getById(id);
      return res.data;
    },
    enabled: !!id, // only fetch if id exists
  });
};

// -----------------------------
// Create Document
// -----------------------------
export const useCreateDocument = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { setDocuments, documents } = useDocumentStore();
  const queryClient = useQueryClient();

  return useMutation<Document, ApiAxiosError, AddDocumentFormData>({
    mutationFn: async (data) => {
      const formData = new FormData();
      const { files, ...rest } = data;
      formData.append("document", files[0]);
      Object.entries(rest).forEach(([k, v]) =>
        formData.append(k, v.toString())
      );
      return (await documentService.create(formData)).data;
    },
    onSuccess: (newDoc) => {
      toast({
        title: t("document.add.toast.success.title"),
        description: t("document.add.toast.success.description"),
        variant: "success",
      });
      setDocuments([...documents, newDoc]);

      queryClient.invalidateQueries({ queryKey: ["departements"] });
    },
    onError: () => {
      toast({
        title: t("document.add.toast.error.title"),
        description: t("document.add.toast.error.description"),
        variant: "destructive",
      });
    },
  });
};

// -----------------------------
// Update Document
// -----------------------------
export const useUpdateDocument = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const setDocuments = useDocumentStore((s) => s.setDocuments);
  const docs = useDocumentStore((s) => s.documents);
  const queryClient = useQueryClient();

  return useMutation<
    any,
    ApiAxiosError,
    { id: string; data: EditDocumentFormData }
  >({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      const { files, ...rest } = data;
      if (files) formData.append("document", files[0]);
      Object.entries(rest).forEach(([k, v]) =>
        formData.append(k, v.toString())
      );
      return (await documentService.update(id, formData)).data;
    },
    onSuccess: (updatedDoc, vars) => {
      toast({
        title: t("document.edit.toast.success.title"),
        description: t("document.edit.toast.success.description"),
        variant: "success",
      });
      setDocuments(docs.map((d) => (d.id === vars.id ? updatedDoc : d)));
      queryClient.invalidateQueries({ queryKey: ["departements"] });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["documents", vars.id] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewStats"] });
      queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["my-reviews-due-soon"] });
      queryClient.invalidateQueries({ queryKey: ["my-expired-and-reviews-due-soon"] });
    },
    onError: () => {
      toast({
        title: t("document.edit.toast.error.title"),
        description: t("document.edit.toast.error.description"),
        variant: "destructive",
      });
    },
  });
};

// -----------------------------
// Delete Document
// -----------------------------
export const useDeleteDocument = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const setDocuments = useDocumentStore((s) => s.setDocuments);
  const docs = useDocumentStore((s) => s.documents);
  const queryClient = useQueryClient();

  return useMutation<any, ApiAxiosError, { id: string }>({
    mutationFn: async ({ id }) => await documentService.delete(id),
    onSuccess: (_, vars) => {
      toast({
        title: t("document.delete.toast.success.title"),
        description: t("document.delete.toast.success.description"),
        variant: "success",
      });
      setDocuments(docs.filter((d) => d.id !== vars.id));
      queryClient.invalidateQueries({ queryKey: ["departements"] });
    },
    onError: () => {
      toast({
        title: t("document.delete.toast.error.title"),
        description: t("document.delete.toast.error.description"),
        variant: "destructive",
      });
    },
  });
};

// -----------------------------
// Publish Document
// -----------------------------
export const usePublishDocument = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  // const setDocuments = useDocumentStore((s) => s.setDocuments);
  // const docs = useDocumentStore((s) => s.documents);
  const queryClient = useQueryClient();
  return useMutation<any, ApiAxiosError, { id: string }>({
    mutationFn: async ({ id }) => await documentService.publish(id),
    onSuccess: () => {
      toast({
        title: t("document.publish.toast.success.title"),
        description: t("document.publish.toast.success.description"),
        variant: "success",
      });
      // setDocuments(docs.map((d) => (d.id === vars.id ? res.data : d)));
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document-versions"] });
      queryClient.invalidateQueries({ queryKey: ["published-documents"] });
    },
    onError: () => {
      toast({
        title: t("document.publish.toast.error.title"),
        description: t("document.publish.toast.error.description"),
        variant: "destructive",
      });
    },
  });
};

// -----------------------------
// Unpublish Document
// -----------------------------
export const useUnpublishDocument = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation<any, ApiAxiosError, { id: string }>({
    mutationFn: async ({ id }) => await documentService.unpublish(id),
    onSuccess: () => {
      toast({
        title: t("document.unpublish.toast.success.title"),
        description: t("document.unpublish.toast.success.description"),
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["document-versions"] });
      queryClient.invalidateQueries({ queryKey: ["published-documents"] });
    },
    onError: () => {
      toast({
        title: t("document.unpublish.toast.error.title"),
        description: t("document.unpublish.toast.error.description"),
        variant: "destructive",
      });
    },
  });
};

// -----------------------------
// Download Document
// -----------------------------
export const useDownloadDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<any, ApiAxiosError, { id: string }>({
    mutationFn: async ({ id }) => await documentService.download(id),
    onSuccess: (res) => {
      const disposition = res.headers["content-disposition"];
      downloadBlob(res.data, disposition);
      queryClient.invalidateQueries({ queryKey: ["audits"] });
    },
  });
};

// --------------------------
// Create draft version
// --------------------------
export const useCreateDraftVersion = (reviewId?: string) => {
  return useQuery<DocumentVersion, ApiAxiosError>({
    queryKey: ["create-draft-version", reviewId],
    queryFn: async () =>
      (await documentService.createDraftVersion(reviewId!)).data,
    enabled: !!reviewId,
    staleTime: 1000 * 60 * 3,
  });
};


export const useGetPublishedDocuments = () => {
  const { user } = useAuth();
  return useQuery<Document[], ApiAxiosError>({
    queryKey: ["published-documents"],
    queryFn: async () => (await documentService.getPublished(user.id)).data,
    staleTime: 1000 * 60 * 3,
  });
}

// Recently viewed documents
export const useGetRecenltyViewedDocuments = () => {
  const { user } = useAuth();
  return useQuery<RecentlyViewedDocument[], ApiAxiosError>({
    queryKey: ["recenly-viewed-documents"],
    queryFn: async () => (await documentService.getRecenlyViewed(user.id)).data,
    staleTime: 1000 * 60 * 3,
  });
}

export const useAddDocumentToRecenltyViewed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation<any, ApiAxiosError, { documentId: string }>({
    mutationFn: async ({ documentId }) => await documentService.addToRecenlyViewed(user.id, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recenly-viewed-documents"] });
    },
    onError: () => {
      console.error("Failed to add document to recenly viewed");
    },
  });
}
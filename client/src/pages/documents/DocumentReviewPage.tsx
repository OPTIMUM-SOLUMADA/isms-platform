import { useTranslation } from "react-i18next";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { DocumentReview } from "@/types";
// import { v4 as uuid } from "uuid";

// const statusClasses = {
//   pending: "bg-yellow-100 text-yellow-800",
//   in_review: "bg-blue-100 text-blue-800",
//   approved: "bg-green-100 text-green-800",
//   rejected: "bg-red-100 text-red-800",
// } as const;


export const DocumentReviewPage: React.FC<{
  review: DocumentReview;
  onAddComment: (reviewId: string, commentText: string, author?: string) => void;
}> = ({ review, onAddComment }) => {
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(review.id, newComment.trim(), author || "Anonyme");
    setNewComment("");
    setAuthor("");
  }

  const { t } = useTranslation();



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t("review.title")}
          </h1>
          <p className="text-gray-600 mt-1">{t("review.subtitle")}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-sm flex items- start justify-between">
        <div>
          <div className="flex gap-2 items-baseline">
            <h4 className="font-medium">{review?.reviewer?.name}</h4>
            <span className="text-xs text-slate-500">
              {/* {new Date(review?.reviewDate).  toLocaleString()} */}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
            {review.comment ? review.comment : "— Aucun commentaire —"}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {/* Bouton Détails: ouvre Dialog avec Tabs */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="px-3 py-1 rounded-md bg-indigo-600 text-white text-sm">Détails</button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40" />
              <Dialog.Content className="fixed left-1/2 top-1/2 w-[min(96%,700px)] max-h-[85vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold">Review — {review?.reviewer?.name}</h3>
                <Tabs.Root defaultValue="comments" className="mt-4">
                  <Tabs.List className="flex gap-2">
                    <Tabs.Trigger value="comments" className="px-3 py-1 rounded-md">Commentaires</Tabs.Trigger>
                    <Tabs.Trigger value="add" className="px-3 py-1 rounded-md">Ajouter un commentaire</Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="add" className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        placeholder="Votre nom (optionnel)"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      />
                      <textarea
                        required
                        placeholder="Écrire un commentaire..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full border rounded px-3 py-2 min-h-[100px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Dialog.Close asChild>
                          <button type="button" className="px-3 py-2 rounded-md bg-slate-200">Annuler</button>
                        </Dialog.Close>
                        <button type="submit" className="px-3 py-2 rounded-md bg-indigo-600 text-white">Ajouter</button>
                      </div>
                    </form>
                  </Tabs.Content>
                </Tabs.Root>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
};

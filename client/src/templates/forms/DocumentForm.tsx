import { z } from "zod";
import { cz } from "@/lib/czod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { CustomFormProps } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { useTranslation } from "react-i18next";
import ErrorCodeField from "@/components/ErrorCodeField";
import i18n from "@/i18n/config";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

const documentSchema = cz.z.object({
  title: z.string().nonempty(i18n.t("zod.errors.required")),
  description: z.string().optional(),
  fileUrl: z.string().url().optional(),
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "EXPIRED"]),
  nextReviewDate: z.string().optional(), // ou z.date() si tu veux
  reviewFrequency: z.number().int().positive().optional(),

  owner: z
    .object({
      id: z.string().nonempty(i18n.t("zod.errors.required")),
      name: z.string().optional(),
    })
    .optional(),

  category: z
    .object({
      id: z.string().nonempty(i18n.t("zod.errors.required")),
      name: z.string().optional(),
    })
    .optional(),
});

export type DocumentFormData = z.infer<typeof documentSchema>;

type DocumentFormProps = CustomFormProps<DocumentFormData>;

export default function DocumentForm({
  isPending = false,
  onSubmit,
  error,
}: DocumentFormProps) {
  const { t } = useTranslation();

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: "",
      description: "",
      fileUrl: "",
      status: "DRAFT",
      nextReviewDate: "",
      reviewFrequency: undefined,
      owner: { id: "" },
      category: { id: "" },
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const url = URL.createObjectURL(file);
        setValue("fileUrl", url, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "image/*": [] }, // exemple: PDF + images
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-5xl mx-auto p-6 bg-white space-y-6"
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                {t("document.title")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t("document.title.placeholder")}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.description")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={t("document.description.placeholder")}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.status")}
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="DRAFT">{t("document.status.draft")}</option>
                    <option value="IN_REVIEW">
                      {t("document.status.review")}
                    </option>
                    <option value="APPROVED">
                      {t("document.status.approved")}
                    </option>
                    <option value="EXPIRED">
                      {t("document.status.expired")}
                    </option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Next Review Date */}
          <FormField
            control={form.control}
            name="nextReviewDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.nextReviewDate")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Review Frequency */}
          <FormField
            control={form.control}
            name="reviewFrequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.reviewFrequency")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={t("document.reviewFrequency.placeholder")}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Owner ID */}
          <FormField
            control={form.control}
            name="owner.id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.owner")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={t("document.owner.placeholder")}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category ID */}
          <FormField
            control={form.control}
            name="category.id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.category")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={t("document.category.placeholder")}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* File URL */}
        <FormField
          control={form.control}
          name="fileUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                {t("document.fileUrl")}
              </FormLabel>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                {field.value ? (
                  <p className="text-sm text-green-600">
                    {t("document.file.selected")}: {field.value}
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {isDragActive
                      ? t("document.file.dropHere")
                      : t("document.file.dragOrClick")}
                  </p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Error */}
        <ErrorCodeField code={error} />

        {/* Submit */}
        <LoadingButton
          type="submit"
          className=" bg-green-600 hover:bg-green-700 text-white rounded-xl py-3 font-semibold shadow-md transition"
          isLoading={isPending || isSubmitting}
          loadingText={t("document.form.actions.submit.loading")}
        >
          {t("document.form.actions.submit.label")}
        </LoadingButton>
      </form>
    </Form>
  );
}

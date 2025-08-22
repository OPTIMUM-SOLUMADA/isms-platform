import { z } from "zod";
import { cz } from "@/lib/czod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { CustomFormProps, ISOClause } from "@/types";
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import FileUpload from "@/components/file-upload";
import { formatBytes } from "@/hooks/use-file-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { documentStatus } from "@/constants/document";
import { Textarea } from "@/components/ui/textarea";

const maxFileSize = 20 * 1024 * 1024;

const documentSchema = cz.z.object({
  id: z.string().nonempty(i18n.t("zod.errors.required")),
  title: z.string().nonempty(i18n.t("zod.errors.required")),
  description: z.string().optional(),
  fileUrl: z.string().url().optional(),
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "EXPIRED"]),

  nextReviewDate: z.string().optional(), // ou z.date() si tu veux
  reviewFrequency: z.number().int().positive().optional(),

  owner: z.string().nonempty(i18n.t("zod.errors.required")),
  ownerId: z.string().nonempty(i18n.t("zod.errors.required")),

  category: z.string().nonempty(i18n.t("zod.errors.required")),
  categoryId: z.string().nonempty(i18n.t("zod.errors.required")),

  department: z.string().nonempty(i18n.t("zod.errors.required")),

  isoClause: z.string().nonempty(i18n.t("zod.errors.required")),
  isoClauseId: z.string().nonempty(i18n.t("zod.errors.required")),

  files: z
    .array(z.custom<File>())
    .min(1, "Please select at least one file")
    .refine((files) => files.every((file) => file.size <= maxFileSize), {
      message: "File size must be less than 5MB",
      path: ["files"],
    }),
});

export type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentFormProps extends CustomFormProps<DocumentFormData> {
  isoClauses: ISOClause[];
}

export default function DocumentForm({
  isPending = false,
  onSubmit,
  error,
  isoClauses
}: DocumentFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      fileUrl: "",
      status: "DRAFT",
      nextReviewDate: "",
      reviewFrequency: undefined
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;


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
                {t("document.forms.add.name.label")}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t("document.forms.add.name.placeholder")}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">
                {t("document.forms.add.description.label")}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder={t("document.forms.add.description.placeholder")}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Category ID */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.forms.add.category.label")}
                </FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('document.forms.add.category.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(documentStatus).map(([status, index]) => (
                        <SelectItem key={index} value={status}>
                          {t(`document.forms.add.status.${status.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {t("document.forms.add.status.label")}
                </FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('document.forms.add.status.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(documentStatus).map(([status, index]) => (
                        <SelectItem key={index} value={status}>
                          {t(`common.document.status.${status.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="isoClause"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.forms.add.status.label")}
                </FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('document.forms.add.status.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {isoClauses.map((item, index) => (
                        <SelectItem key={index} value={item.id}>
                          {item.code} - {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {t("document.forms.add.reviewFrequency.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder={t("document.forms.add.reviewFrequency.placeholder")}
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
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.forms.add.owner.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={t("document.forms.add.owner.placeholder")}
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
          name="files"
          render={() => (
            <FormItem>
              <FormLabel className="font-medium">
                {t("document.forms.add.file.label")}
              </FormLabel>
              <FormControl>
                <FileUpload
                  title={t("components.fileUpload.title.singular")}
                  description={t("components.fileUpload.dragAndDrop")}
                  maxSizeDescription={t("components.fileUpload.maxSize", {
                    size: formatBytes(maxFileSize),
                  })}
                  onFileUpload={(files) => {
                    form.setValue("files", files);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Error */}
        <ErrorCodeField code={error} />

        <div className="flex justify-end gap-4">
          <Button
            type="reset"
            variant={"ghost"}
            className="btn bg-gray-50"
            onClick={() => navigate("/documents")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("document.forms.add.actions.cancel.label")}
          </Button>
          {/* Submit */}
          <LoadingButton
            type="submit"
            className="btn"
            isLoading={isPending || isSubmitting}
            loadingText={t("document.forms.add.actions.submit.loading")}
          >
            <Save className="mr-2 h-4 w-4" />
            {t("document.forms.add.actions.submit.label")}
          </LoadingButton>

        </div>
      </form>
    </Form>
  );
}

import { z } from "zod";
import { cz } from "@/lib/czod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import type { Department, Document, CustomFormProps, DocumentType, ISOClause, User } from "@/types";
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
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import { formatBytes } from "@/hooks/use-file-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { documentStatus } from "@/constants/document";
import { Textarea } from "@/components/ui/textarea";
import UserLookup from "@/templates/lookup/UserLookup";
import UserMultiSelect from "@/templates/multiselect/UserMultiselect";
import { forwardRef, useImperativeHandle } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { RoleType } from "@/types/role";
import { DocumentFileUpload } from "@/templates/uploader/DocumentFileUpload";

const maxFileSize = 0.5 * 1024 * 1024;

const documentSchema = cz.z.object({
  title: z.string().nonempty(i18n.t("zod.errors.required")),
  description: z.string().optional(),
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "EXPIRED"]),
  owner: z.string().nonempty(i18n.t("zod.errors.required")).min(1, i18n.t("zod.errors.required")),
  type: z.string().nonempty(i18n.t("zod.errors.required")),
  department: z.string().nonempty(i18n.t("zod.errors.required")),
  isoClause: z.string().nonempty(i18n.t("zod.errors.required")),
  reviewers: z.array(z.string()).min(1, i18n.t("zod.errors.required")),
  files: z
    .array(z.custom<File>())
    .refine((files) => files.every((file) => file.size <= maxFileSize), {
      message: i18n.t("components.fileUpload.errors.fileTooLarge", {
        size: formatBytes(maxFileSize),
      }),
    })
    .optional(),

});

export type EditDocumentFormData = z.infer<typeof documentSchema>;

interface EdutDocumentFormProps extends CustomFormProps<EditDocumentFormData> {
  isoClauses: ISOClause[];
  types: DocumentType[];
  users: User[];
  departments: Department[];
  doc: Document;
}

export type EditDocumentFormRef = {
  resetForm: () => void;
  isStay: () => boolean;
};

const EditDocumentForm = forwardRef<EditDocumentFormRef, EdutDocumentFormProps>(
  (
    {
      doc,
      isPending = false,
      onSubmit,
      error,
      isoClauses = [],
      types = [],
      users = [],
      departments = [],
    },
    ref
  ) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [stay, setStay] = useLocalStorage("editDocumentFormStay", false);

    const form = useForm<EditDocumentFormData>({
      resolver: zodResolver(documentSchema),
      defaultValues: {
        title: doc.title,
        description: doc.description!,
        status: doc.status,
        owner: doc.ownerId,
        isoClause: doc.isoClauseId,
        reviewers: doc.reviewersId,
        files: [],
        type: doc.categoryId,
        department: doc.departmentId,
      },
      mode: "onChange",
    });

    const {
      handleSubmit,
      formState: { isSubmitting },
    } = form;


    // expose resetForm method
    useImperativeHandle(ref, () => ({
      resetForm: () => form.reset(),
      isStay: () => stay
    }));


    return (
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.add.form.fields.name.label")}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder={t("document.add.form.fields.name.placeholder")}
                    className="border rounded-lg px-3 py-2 w-full"
                    hasError={!!fieldState.error}
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
                  {t("document.add.form.fields.description.label")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={t("document.add.form.fields.description.placeholder")}
                    className="border rounded-lg px-3 py-2 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Types ID */}
            <FormField
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {t("document.add.form.fields.type.label")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger hasError={!!fieldState.error}>
                        <SelectValue placeholder={t('document.add.form.fields.type.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map((item, index) => (
                          <SelectItem key={index} value={item.id}>
                            {item.name}
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
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {t("document.add.form.fields.status.label")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger hasError={!!fieldState.error}>
                        <SelectValue placeholder={t('document.add.form.fields.status.placeholder')} />
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

            {/* Department */}
            <FormField
              control={form.control}
              name="department"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {t("document.add.form.fields.department.label")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger hasError={!!fieldState.error}>
                        <SelectValue placeholder={t('document.add.form.fields.department.placeholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((item, index) => (
                          <SelectItem key={index} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Clause */}
            <FormField
              control={form.control}
              name="isoClause"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-medium">
                    {t("document.add.form.fields.isoClause.label")}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger hasError={!!fieldState.error}>
                        <SelectValue placeholder={t('document.add.form.fields.isoClause.placeholder')} />
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

            {/* Owner */}
            <FormField
              control={form.control}
              name="owner"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {t("document.add.form.fields.owner.label")}
                  </FormLabel>
                  <FormControl>
                    <UserLookup
                      data={users}
                      value={field.value}
                      onValueChange={field.onChange}
                      hasError={!!fieldState.error}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reviewers */}
            <FormField
              control={form.control}
              name="reviewers"
              render={({ field, fieldState }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="font-medium">
                    {t("document.add.form.fields.reviewer.label")}
                  </FormLabel>
                  <FormControl>
                    <UserMultiSelect
                      data={users.filter(user => user.role !== RoleType.VIEWER)}
                      value={field.value}
                      onValueChange={field.onChange}
                      hasError={!!fieldState.error}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.add.form.fields.file.label")}
                </FormLabel>
                <FormControl>
                  <DocumentFileUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error */}
          <ErrorCodeField code={error} />

          <div className="flex justify-between gap-4 border-t py-4">

            <div className="flex items-center gap-3">
              <Checkbox id="terms" checked={stay} onCheckedChange={(val) => setStay(!!val)} />
              <Label htmlFor="terms">{t("common.form.edit.stay")}</Label>
            </div>
            <div className="flex gap-4 items-center">
              <Button
                type="reset"
                variant={"ghost"}
                className="btn bg-gray-50"
                onClick={() => navigate("/documents")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("document.edit.form.actions.cancel.label")}
              </Button>
              <Button
                type="reset"
                variant={"ghost"}
                className="btn bg-gray-50"
                onClick={() => form.reset()}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("document.edit.form.actions.reset.label")}
              </Button>
              {/* Submit */}
              <LoadingButton
                type="submit"
                className="btn"
                isLoading={isPending || isSubmitting}
                loadingText={t("document.edit.form.actions.submit.loading")}
              >
                <Save className="mr-2 h-4 w-4" />
                {t("document.edit.form.actions.submit.label")}
              </LoadingButton>
            </div>

          </div>
        </form>
      </Form>
    );
  });

export default EditDocumentForm;
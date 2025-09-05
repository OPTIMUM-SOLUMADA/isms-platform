import { z } from "zod";
import { cz } from "@/lib/czod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Department, type CustomFormProps, type DocumentType, type ISOClause, type User } from "@/types";
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
import { documentStatus, DocumentStatuses } from "@/constants/document";
import { Textarea } from "@/components/ui/textarea";
import UserMultiSelect from "@/templates/multiselect/UserMultiselect";
import { forwardRef, useImperativeHandle } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { RoleType } from "@/types/role";
import { DocumentFileUpload } from "@/templates/uploader/DocumentFileUpload";
import { Frequencies, FrequenciesUnits } from "@/constants/frequency";
import Required from "@/components/Required";

const maxFileSize = 0.5 * 1024 * 1024;

const documentSchema = cz.z.object({
  title: z.string().nonempty(i18n.t("zod.errors.required")),
  description: z.string().optional(),
  status: z.enum(DocumentStatuses),
  reviewFrequency: z.enum(FrequenciesUnits).optional(),
  owners: z.array(z.string()).min(1, i18n.t("zod.errors.required")),
  type: z.string().nonempty(i18n.t("zod.errors.required")),
  department: z.string().nonempty(i18n.t("zod.errors.required")),
  isoClause: z.string().nonempty(i18n.t("zod.errors.required")),
  reviewers: z.array(z.string()).optional(),
  files: z
    .array(z.custom<File>())
    .min(1, { message: i18n.t("components.fileUpload.errors.required") })
    .refine((files) => files.every((file) => file.size <= maxFileSize), {
      message: i18n.t("components.fileUpload.errors.fileTooLarge", {
        size: formatBytes(maxFileSize),
      }),
    }),
});

export type AddDocumentFormData = z.infer<typeof documentSchema>;

interface AddDocumentFormProps extends CustomFormProps<AddDocumentFormData> {
  isoClauses: ISOClause[];
  types: DocumentType[];
  users: User[];
  departments: Department[];
}

export type AddDocumentFormRef = {
  resetForm: () => void;
  isStay: () => boolean;
};

const AddDocumentForm = forwardRef<AddDocumentFormRef, AddDocumentFormProps>(
  (
    {
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

    const [stay, setStay] = useLocalStorage("addDocumentFormStay", false);

    const form = useForm<AddDocumentFormData>({
      resolver: zodResolver(documentSchema),
      defaultValues: {
        title: "",
        description: "",
        status: documentStatus.DRAFT,
        owners: [],
        isoClause: "",
        reviewers: [],
        files: [],
        type: "",
        department: "",
        reviewFrequency: Frequencies.DAILY,
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
                  {t("document.add.form.fields.name.label")} <Required />
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
                    {t("document.add.form.fields.type.label")} <Required />
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
                <FormItem className="hidden">
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
                    {t("document.add.form.fields.department.label")} <Required />
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
                <FormItem>
                  <FormLabel className="font-medium">
                    {t("document.add.form.fields.isoClause.label")} <Required />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Owner */}
            <FormField
              control={form.control}
              name="owners"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    {t("document.add.form.fields.owners.label")} <Required />
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

            <FormField
              control={form.control}
              name="reviewFrequency"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel className="font-medium">
                    {t("document.add.form.fields.reviewFrequency.label")} <Required />
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FrequenciesUnits.map((item, index) => (
                            <SelectItem key={index} value={item}>
                              {t(`document.add.form.fields.reviewFrequencyUnit.options.${item.toLowerCase()}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
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
                    {t("document.add.form.fields.reviewers.label")}
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
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  {t("document.add.form.fields.file.label")} <Required />
                </FormLabel>
                <FormControl>
                  <DocumentFileUpload
                    value={field.value}
                    onChange={field.onChange}
                    hasError={!!fieldState.error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error */}
          <ErrorCodeField code={error} />

          <div className="flex flex-wrap justify-between gap-4 border-t py-4">

            <div className="flex items-center gap-3">
              <Checkbox id="terms" checked={stay} onCheckedChange={(val) => setStay(!!val)} />
              <Label htmlFor="terms">{t("common.form.add.stay")}</Label>
            </div>
            <div className="flex gap-4 items-center flex-wrap">
              <Button
                type="reset"
                variant={"ghost"}
                className="btn bg-gray-50"
                onClick={() => navigate("/documents")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("document.add.form.actions.cancel.label")}
              </Button>
              <Button
                type="reset"
                variant={"ghost"}
                className="btn bg-gray-50"
                onClick={() => form.reset()}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {t("document.add.form.actions.reset.label")}
              </Button>
              {/* Submit */}
              <LoadingButton
                type="submit"
                className="btn"
                isLoading={isPending || isSubmitting}
                loadingText={t("document.add.form.actions.submit.loading")}
              >
                <Save className="mr-2 h-4 w-4" />
                {t("document.add.form.actions.submit.label")}
              </LoadingButton>
            </div>

          </div>
        </form>
      </Form>
    );
  });

export default AddDocumentForm;
// ReviewForm.tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import UserLookup from "@/templates/users/lookup/UserLookup";
import i18n from "@/i18n/config";
import { Document, User } from "@/types";
import DocumentLookup from "@/templates/documents/lookup/DocumentLookup";


// ✅ Validation schema
const formSchema = z.object({
  document: z.string().nonempty(i18n.t("review.errors.document")),
  reviewer: z.string().nonempty(i18n.t("review.errors.reviewer")),
  dueDate: z.string().nonempty(i18n.t("review.errors.date")),
})

interface ReviewFormProps {
  documents: Document[]
  users: User[] // <-- la liste des reviewers
  onSubmit: (data: any) => void
}

export default function ReviewForm({ documents, users, onSubmit }: ReviewFormProps) {
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document: "",
      reviewer: "",
      dueDate: "",
    },
  })

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("review.form.documentReview")}</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("review.form.documentReviewPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doc1">Doc 1</SelectItem>
                    <SelectItem value="doc2">Doc 2</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* Document */}
        <FormField
          control={form.control}
          name="document"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("review.form.documentReview")}</FormLabel>
              <FormControl>
                <DocumentLookup
                  data={documents}
                  value={field.value}
                  onValueChange={field.onChange}
                  hasError={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reviewer (Owner) */}
        <FormField
          control={form.control}
          name="reviewer"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{t("review.form.assigneReviewer")}</FormLabel>
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

        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("review.form.dueDate")}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {t("review.button.assignReview")}
        </Button>
      </form>
    </Form>
  )
}

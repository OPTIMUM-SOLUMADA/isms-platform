import i18n from "@/i18n/config";
import { CustomFormProps } from "@/types";
import z from "zod";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Form } from "react-router-dom";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

const addDepartmentSchema = z.object({
    name: z.string().nonempty(i18n.t("zod.errors.required")),
    description: z.string().optional(),
});

export type AddDepartmentFormData = z.infer<typeof addDepartmentSchema>;

type AddDepartmentFormProps = CustomFormProps<AddDepartmentFormData>;

const AddDepartmentForm = ({
    onSubmit,
    error
}: AddDepartmentFormProps) => {
    const {t} = useTranslation();

    const form = useForm<AddDepartmentFormData>({
        resolver: zodResolver(addDepartmentSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    const {
        handleSubmit
    } = form;

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                {/* name */}
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("department.form.name.label")}</FormLabel>
                            <FormControl>
                                <Input 
                                    placeholder={t("department.form.name.placeholder")}
                                    {...field} 
                                    type="text"
                                    className="border rounded-lg px-3 py-2 w-full"
                                    hasError={!!error}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* description */}
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("department.form.description.label")}</FormLabel>
                            <FormControl>
                                <Input placeholder={t("department.form.description.placeholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
    
}

export default AddDepartmentForm
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AuditFooter } from "@/components/shared/audit-footer";
import { ImageUpload } from "@/components/shared/image-upload";
import { SlugField } from "@/components/shared/slug-field";
import { SeoAccordion } from "@/components/shared/seo-accordion";
import { blogCategoryFormSchema, BlogCategoryFormInput, BlogCategoryFormValues } from "@/lib/schemas/blog-category";
import { useCreateBlogCategory, useUpdateBlogCategory } from "@/lib/queries/blog-categories";
import { applyFieldErrors } from "@/lib/apply-field-errors";
import { getErrorMessage, getFieldErrors } from "@/lib/api-client";
import { BlogCategory, Status, STATUS_LABELS } from "@/lib/types";

const BACK_HREF = "/blog-categories";

export function BlogCategoryForm({ category }: { category?: BlogCategory }) {
  const router = useRouter();
  const isEdit = !!category;

  const createCategory = useCreateBlogCategory();
  const updateCategory = useUpdateBlogCategory(category?.id ?? 0);

  const form = useForm<BlogCategoryFormInput, unknown, BlogCategoryFormValues>({
    resolver: zodResolver(blogCategoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      image: category?.image ?? "",
      status: category?.status ?? "ACTIVE",
      metaTitle: category?.metaTitle ?? "",
      metaDescription: category?.metaDescription ?? "",
      canonicalUrl: category?.canonicalUrl ?? "",
      ogTitle: category?.ogTitle ?? "",
      ogDescription: category?.ogDescription ?? "",
      ogImage: category?.ogImage ?? "",
      robots: category?.robots ?? "noindex, nofollow",
    },
  });

  const onSubmit = async (values: BlogCategoryFormValues) => {
    try {
      if (isEdit) {
        await updateCategory.mutateAsync(values);
        toast.success("Blog category updated");
      } else {
        await createCategory.mutateAsync(values);
        toast.success("Blog category created");
      }
      router.push(BACK_HREF);
    } catch (error) {
      applyFieldErrors(getFieldErrors(error), form.setError);
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <SlugField value={field.value ?? ""} onChange={field.onChange} deriveFrom={form.watch("name")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload label="Image" value={field.value} onChange={field.onChange} aspect="wide" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="max-w-xs">
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue>{(value: Status) => STATUS_LABELS[value]}</SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <SeoAccordion defaultOpen={false} />
          </CardContent>
        </Card>

        {category && <AuditFooter record={category} />}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(BACK_HREF)}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {isEdit ? "Save Changes" : "Create Blog Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

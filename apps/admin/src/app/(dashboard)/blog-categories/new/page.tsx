import { BlogCategoryForm } from "@/components/forms/blog-category-form";

export default function NewBlogCategoryPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Add Blog Category</h1>
        <p className="text-sm text-muted-foreground">Create a new blog category.</p>
      </div>
      <BlogCategoryForm />
    </div>
  );
}

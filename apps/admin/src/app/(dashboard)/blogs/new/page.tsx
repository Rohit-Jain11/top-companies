import { BlogForm } from "@/components/forms/blog-form";

export default function NewBlogPage() {
  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Add Blog</h1>
        <p className="text-sm text-muted-foreground">Create a new blog post.</p>
      </div>
      <BlogForm />
    </div>
  );
}

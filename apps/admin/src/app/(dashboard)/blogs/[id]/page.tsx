"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { BlogForm } from "@/components/forms/blog-form";
import { useBlogQuery } from "@/lib/queries/blogs";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const { data: blog, isLoading } = useBlogQuery(Number(params.id));

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Edit Blog</h1>
        <p className="text-sm text-muted-foreground">Update this blog&apos;s details.</p>
      </div>
      {isLoading || !blog ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <BlogForm blog={blog} />
      )}
    </div>
  );
}

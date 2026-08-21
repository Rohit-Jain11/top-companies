"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { resetPasswordSchema, ResetPasswordValues } from "@/lib/schemas/auth";
import { useResetPassword } from "@/lib/queries/auth";
import { getErrorMessage } from "@/lib/api-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const resetPassword = useResetPassword();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (!token || !email) {
    return (
      <Card className="ring-0 py-6 rounded-2xl shadow-card!">
        <CardHeader className="px-6">
          <CardTitle className="text-lg text-foreground">Invalid link</CardTitle>
          <CardDescription>This password reset link is missing required information.</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Request a new link
          </Link>
        </CardContent>
      </Card>
    );
  }

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      await resetPassword.mutateAsync({ token, email, password: values.password });
      toast.success("Password reset. Please sign in.");
      router.push("/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card className="ring-0 py-6 rounded-2xl shadow-card! gap-6">
      <CardHeader className="px-6">
        <CardTitle className="text-lg text-foreground">Reset password</CardTitle>
        <CardDescription>Choose a new password for {email}.</CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">New password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="border border-[#f0f2f5] px-4 py-3.5 h-auto outline-none shadow-none ring-0 focus:ring-0 focus-visible:border-[#f0f2f5] focus-visible:ring-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Confirm password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="border border-[#f0f2f5] px-4 py-3.5 h-auto outline-none shadow-none ring-0 focus:ring-0 focus-visible:border-[#f0f2f5] focus-visible:ring-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-auto rounded-full bg-foreground px-6.5 py-3 text-lg font-semibold text-white hover:bg-primary transition-all ease-in-out duration-250 w-full cursor-pointer" disabled={resetPassword.isPending}>
              {resetPassword.isPending ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { forgotPasswordSchema, ForgotPasswordValues } from "@/lib/schemas/auth";
import { useForgotPassword } from "@/lib/queries/auth";
import { getErrorMessage } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const forgotPassword = useForgotPassword();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    try {
      await forgotPassword.mutateAsync(values);
      setSent(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card className="ring-0 py-6 rounded-2xl shadow-card! gap-6">
      <CardHeader className="px-6">
        <CardTitle className="text-lg text-foreground">Forgot password</CardTitle>
        <CardDescription>
          {sent
            ? "If an account exists for that email, a reset link has been sent."
            : "Enter your email and we'll send you a reset link."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6">
        {!sent && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@topdevelopmentcompany.com" {...field} className="border border-[#f0f2f5] px-4 py-3.5 h-auto outline-none shadow-none ring-0 focus:ring-0 focus-visible:border-[#f0f2f5] focus-visible:ring-0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="h-auto rounded-full bg-foreground px-6.5 py-3 text-lg font-semibold text-white hover:bg-primary transition-all ease-in-out duration-250 w-full cursor-pointer" disabled={forgotPassword.isPending}>
                {forgotPassword.isPending ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </Form>
        )}
        <p className="text-center text-sm">
          <Link href="/login" className="text-foreground underline">
            Back to sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

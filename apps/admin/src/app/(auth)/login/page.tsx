"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, LoginValues } from "@/lib/schemas/auth";
import { useLogin } from "@/lib/queries/auth";
import { getErrorMessage } from "@/lib/api-client";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      await login.mutateAsync(values);
      router.push("/dashboard");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card className="ring-0 py-6 rounded-2xl shadow-card! gap-6">
      <CardHeader className="px-6">
        <CardTitle className="text-lg text-foreground">Sign in</CardTitle>
        <CardDescription>Enter your credentials to access the admin panel.</CardDescription>
      </CardHeader>
      <CardContent className="px-6">
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-foreground">Password</FormLabel>
                    <Link href="/forgot-password" className="text-xs text-foreground underline">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="border border-[#f0f2f5] px-4 py-3.5 h-auto outline-none shadow-none ring-0 focus:ring-0 focus-visible:border-[#f0f2f5] focus-visible:ring-0" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="h-auto rounded-full bg-foreground px-6.5 py-3 text-lg font-semibold text-white hover:bg-primary transition-all ease-in-out duration-250 w-full cursor-pointer" disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

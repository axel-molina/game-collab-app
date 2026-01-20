import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const feedbackSchema = z.object({
  type: z.enum(["bug", "suggestion"]),
  subject: z
    .string()
    .min(5, { message: "Subject must be at least 5 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" }),
  email: z.string().email().optional().or(z.literal("")),
  _gotcha: z.string().optional(),
  captcha_answer: z.string().min(1, { message: "Result is required" }),
});

type FeedbackValues = z.infer<typeof feedbackSchema>;

export default function Feedback() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState({
    n1: Math.floor(Math.random() * 10),
    n2: Math.floor(Math.random() * 10),
  });

  const form = useForm<FeedbackValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "bug",
      subject: "",
      message: "",
      email: "",
      _gotcha: "",
      captcha_answer: "",
    },
  });

  const onSubmit = async (values: FeedbackValues) => {
    // Check captcha
    if (parseInt(values.captcha_answer) !== captcha.n1 + captcha.n2) {
      form.setError("captcha_answer", { message: t("feedback.captcha_error") });
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch("https://formspree.io/f/xvzzregj", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { Accept: "application/json" },
      });

      toast.success(t("feedback.success_title"), {
        description: t("feedback.success_message"),
      });
      form.reset();
      setCaptcha({
        n1: Math.floor(Math.random() * 10),
        n2: Math.floor(Math.random() * 10),
      });
    } catch (error) {
      toast.error(t("feedback.error_message"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("projects.back")}
        </Link>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("feedback.title")}
            </CardTitle>
            <CardDescription>{t("feedback.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Honeypot field - hidden from users */}
                <FormField
                  control={form.control}
                  name="_gotcha"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormControl>
                        <Input {...field} tabIndex={-1} autoComplete="off" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.type_label")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bug">
                            {t("feedback.bug")}
                          </SelectItem>
                          <SelectItem value="suggestion">
                            {t("feedback.suggestion")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.subject_label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("feedback.subject_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.message_label")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("feedback.message_placeholder")}
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("feedback.email_label")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("feedback.email_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <CardDescription className="text-xs pt-1">
                        {t("auth.spam_reminder")}
                      </CardDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="captcha_answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("feedback.captcha_label", {
                          num1: captcha.n1,
                          num2: captcha.n2,
                        })}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("feedback.captcha_placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("common.translating")
                    : t("feedback.submit")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostForm } from "@/components/posts/PostForm";
import {
  useProjectPost,
  useUpdatePost,
  extractTitleFromContent,
} from "@/hooks/useProjectPosts";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { useTranslation } from "react-i18next";

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: post, isLoading } = useProjectPost(id!);
  const updatePost = useUpdatePost();
  const { t } = useTranslation();

  // Redirect if not authenticated or not the author
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      } else if (post && post.user_id !== user.id) {
      navigate(`/posts/${id}`);
    }
  }, [user, post, id, navigate]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    project_id: string;
  }) => {
    if (!id) return;

    await updatePost.mutateAsync({
      id,
      data: {
        title: data.title,
        content: data.content,
      },
    });

    navigate(`/posts/${id}`);
  };

  const handleCancel = () => {
    navigate(`/posts/${id}`);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!post || !user || post.user_id !== user.id) {
    return null;
  }

  const title = extractTitleFromContent(post.content);
  const contentLines = post.content.split("\n");
  const content = contentLines.slice(1).join("\n").trim();

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{t("posts.edit_title")}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("posts.edit_subtitle")}
            </p>
          </CardHeader>
          <CardContent>
            <PostForm
              initialData={{
                title,
                content,
                project_id: post.project_id,
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={updatePost.isPending}
              submitLabel={t("posts.save")}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostForm } from "@/components/posts/PostForm";
import { useCreatePost } from "@/hooks/useProjectPosts";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createPost = useCreatePost();
  const { t } = useTranslation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleSubmit = async (data: {
    title: string;
    content: string;
    project_id: string;
  }) => {
    const result = await createPost.mutateAsync({
      project_id: data.project_id,
      title: data.title,
      content: data.content,
    });

    if (result) {
      navigate(`/posts/${result.id}`);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {t("posts.create_title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("posts.create_subtitle")}
            </p>
          </CardHeader>
          <CardContent>
            <PostForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={createPost.isPending}
              submitLabel={t("posts.submit")}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCreateServiceOffering } from "@/hooks/useServiceOfferings";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpinnerComponent from "@/components/Spinner.component";

export default function NewServiceOffering() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const createService = useCreateServiceOffering();

  const [formData, setFormData] = useState({
    title: "",
    specialty: "",
    description: "",
    contact: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (authLoading) {
    return <SpinnerComponent />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const service = await createService.mutateAsync({
        ...formData,
        user_id: user.id,
        image: imageFile,
      });
      navigate(`/services/${service.id}`);
    } catch (error) {
      console.error("Failed to create service:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-8 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/services">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("services.new_title", "Publish Service Offering")}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("services.details", "Service Details")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  {t("services.form.title", "Title")}
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder={t(
                    "services.form.title_placeholder",
                    "e.g. 3D Character Modeler availability",
                  )}
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">
                  {t("services.form.specialty", "Specialty")}
                </Label>
                <Input
                  id="specialty"
                  name="specialty"
                  placeholder={t(
                    "services.form.specialty_placeholder",
                    "e.g. 3D Modeling, Animation, Sound Design",
                  )}
                  value={formData.specialty}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("services.form.description", "Description")}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder={t(
                    "services.form.description_placeholder",
                    "Describe your skills, experience, and the kind of collaboration you are looking for.",
                  )}
                  className="min-h-[150px]"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">
                  {t("services.form.contact", "Contact Info")}
                </Label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder={t(
                    "services.form.contact_placeholder",
                    "Email, Discord username, or portfolio link",
                  )}
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>
                  {t("services.form.image", "Service Image (Optional)")}
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {imageFile ? (
                        <div className="text-center">
                          <p className="mb-2 text-sm font-semibold">
                            {imageFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="w-8 h-8 mb-4 text-muted-foreground"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">
                              {t(
                                "services.form.upload_click",
                                "Click to upload",
                              )}
                            </span>{" "}
                            {t("services.form.upload_drag", "or drag and drop")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={createService.isPending}
                >
                  {t("common.cancel", "Cancel")}
                </Button>
                <Button type="submit" disabled={createService.isPending}>
                  {createService.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("common.publishing", "Publishing...")}
                    </>
                  ) : (
                    t("services.publish", "Publish Service")
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

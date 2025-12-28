import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Loader2 } from "lucide-react";

const LoaderLayout = () => {
  return (
    <Layout>
      <div className="container flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </Layout>
  );
};

export default LoaderLayout;

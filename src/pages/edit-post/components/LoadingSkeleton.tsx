import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
  return (
    <Layout>
      <div className="container max-w-3xl py-8">
        <Skeleton className="h-64 w-full" />
      </div>
    </Layout>
  );
};

export default LoadingSkeleton;

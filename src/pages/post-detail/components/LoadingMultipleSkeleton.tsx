import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";

const LoadingMultipleSkeleton = () => {
  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
      </div>
    </Layout>
  );
};

export default LoadingMultipleSkeleton;

import { Layout } from "./layout/Layout";
import { Loader2 } from "lucide-react";

const SpinnerComponent = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </Layout>
  );
};

export default SpinnerComponent;

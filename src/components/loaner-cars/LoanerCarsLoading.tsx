
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList } from "@/components/ui/tabs";

export function LoanerCarsLoading() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Tabs defaultValue="availableCars" className="w-full">
          <TabsList className="mb-4">
            <Skeleton className="h-10 w-full" />
          </TabsList>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-md" />
            ))}
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}

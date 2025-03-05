"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Layers, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Category, SubCategory } from "@/lib/api/categories";
import { useCategories } from "@/hooks/use-categories";

export default function CategoryClient({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { useCategory } = useCategories();
  const categoryData = useCategory(params.id);
  const [category, setCategory] = useState<Category | undefined>();
  useEffect(() => {
    if (categoryData) {
      setCategory(categoryData.data?.category); // Access the 'data' property of categoryData
      setIsLoading(false);
    }
    console.log(category);
  }, [categoryData]);

  if (isLoading) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {category?.name}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/categories")}>
            Back to Categories
          </Button>
        </div>
      </div>

      {/* Category Details */}
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Information about this product category
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Name
              </h3>
              <p className="mt-1 text-lg">{category?.name}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Description
            </h3>
            <p className="mt-1 whitespace-pre-line">
              {category?.description || "No description provided"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Subcategories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subcategories</CardTitle>
              <CardDescription>
                Subcategories within this category
              </CardDescription>
            </div>
            <div className="flex items-center rounded-full bg-secondary px-3 py-1">
              <Layers className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{category?.sub_categories?.length || 0} subcategories</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {category?.sub_categories && category?.sub_categories.length > 0 ? (
            <div className="space-y-6">
              {category?.sub_categories.map(
                (subcategory: SubCategory, index: number) => (
                  <div
                    key={subcategory.uuid || index}
                    className="rounded-lg border p-4">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">
                        {subcategory.name}
                      </h3>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {subcategory.description || "No description provided"}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex h-[100px] flex-col items-center justify-center space-y-3 rounded-lg border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No subcategories found for this category.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

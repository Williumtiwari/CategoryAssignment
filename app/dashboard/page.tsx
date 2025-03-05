"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";
import { Category } from "@/lib/api/categories";
import { Loader2, Tag, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { useSearchCategories } = useCategories();
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalSubcategories, setTotalSubcategories] = useState(0);
  const [recentCategories, setRecentCategories] = useState<Category[]>([]);

  const { data, isLoading } = useSearchCategories({
    page: 0,
    size: 5,
  });

  useEffect(() => {
    if (data) {
      setTotalCategories(data.total_count);
      setRecentCategories(data.categories);

      // Count subcategories
      const subcategoriesCount = data.categories.reduce(
        (count, category) => count + (category.sub_categories?.length || 0),
        0
      );
      setTotalSubcategories(subcategoriesCount);
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/dashboard/categories/new">Create Category</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{totalCategories}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subcategories
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="text-2xl font-bold">{totalSubcategories}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Categories</CardTitle>
          <CardDescription>
            Recently created or updated categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recentCategories.length > 0 ? (
            <div className="space-y-4">
              {recentCategories.map((category) => (
                <div
                  key={category.uuid}
                  className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.sub_categories?.length || 0} subcategories
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/categories/${category.uuid}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-muted-foreground">
              No categories found. Create your first category to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

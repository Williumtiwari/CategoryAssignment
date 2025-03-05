"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCategories } from "@/hooks/use-categories";
import { SubCategory } from "@/lib/api/categories";

// Schema for subcategory
const subCategorySchema = z.object({
  uuid: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

// Schema for category form
const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  document_id: z.string().optional(),
  media_url: z.string().optional(),
  sub_categories: z.array(subCategorySchema).optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export default function NewCategoryPage() {
  const router = useRouter();
  const { createCategory, isCreating } = useCategories();

  // Initialize form with default values
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      document_id: "",
      media_url: "",
      sub_categories: [],
    },
  });

  // Setup field array for subcategories
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sub_categories",
  });

  // Add a new empty subcategory
  const addSubcategory = () => {
    append({
      name: "",
      description: "",
    });
  };

  // Handle form submission
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      createCategory({
        name: data.name,
        description: data.description || "",
        sub_categories:
          data.sub_categories?.map((sub) => ({
            name: sub.name,
            description: sub.description || "",
            uuid: sub.uuid,
          })) || [],
      });

      // Redirect to categories list on success
      router.push("/dashboard/categories");
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Create New Category
        </h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Category Details</CardTitle>
              <CardDescription>
                Enter the details for your new product category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Clothing" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of your product category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe this category..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A detailed description of what this category includes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Subcategories section */}
          <Card>
            <CardHeader>
              <CardTitle>Subcategories</CardTitle>
              <CardDescription>
                Add subcategories to further organize your products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.length > 0 ? (
                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-4">
                      {index > 0 && <Separator />}
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          Subcategory {index + 1}
                        </h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      {/* Subcategory name */}
                      <FormField
                        control={form.control}
                        name={`sub_categories.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., T-Shirts" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Subcategory description */}
                      <FormField
                        control={form.control}
                        name={`sub_categories.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe this subcategory..."
                                className="min-h-[80px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-[100px] flex-col items-center justify-center space-y-3 rounded-lg border border-dashed p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No subcategories added yet. Click the button below to add
                    one.
                  </p>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={addSubcategory}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subcategory
              </Button>
            </CardContent>
          </Card>

          {/* Submit button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isCreating}
              className="w-full md:w-auto">
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

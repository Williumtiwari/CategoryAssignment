export async function generateStaticParams() {
  return []; // Adjust if you want to pre-generate pages dynamically
}

import CategoryClient from "./CategoryClient"; // Import client component
import { useCategories } from "@/hooks/use-categories";

export default async function CategoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { useCategory } = useCategories();
  const category = await useCategory(params.id); // Fetch category data

  return <CategoryClient category={category} params={params} />;
}

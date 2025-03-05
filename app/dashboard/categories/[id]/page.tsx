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
  return <CategoryClient params={params} />;
}

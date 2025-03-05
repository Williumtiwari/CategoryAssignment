import apiClient from "./api-client";
import Cookies from "js-cookie";

export interface Category {
  uuid: string;
  name: string;
  description: string;
  sub_categories: SubCategory[];
}

export interface SubCategory {
  uuid?: string;
  name: string;
  description: string;
}

export interface CategorySearchParams {
  page: number;
  size: number;
  searchTerm?: string;
}

export interface CategorySearchResponse {
  categories: Category[];
  total_count: number;
  page_count: number;
}

export const createCategory = async (categoryData: Omit<Category, "uuid">) => {
  const user = Cookies.get("user");
  const uuid = user ? JSON.parse(user).uuid : "";

  if (!uuid) {
    throw new Error("Store ID not found");
  }

  const response = await apiClient.post(
    `/store_svc/v1/stores/${uuid}/categories`,
    categoryData
  );

  return response.data;
};

export const updateCategory = async (
  categoryId: string,
  categoryData: Partial<Omit<Category, "id" | "created_at" | "updated_at">>
) => {
  const user = Cookies.get("user");
  const uuid = user ? JSON.parse(user).uuid : "";

  if (!uuid) {
    throw new Error("Store ID not found");
  }

  const response = await apiClient.put(
    `/store_svc/v1/stores/${uuid}/categories/${categoryId}`,
    categoryData
  );

  return response.data;
};

export const getCategoryById = async (categoryId: string) => {
  const user = Cookies.get("user");
  const uuid = user ? JSON.parse(user).uuid : "";

  if (!uuid) {
    throw new Error("Store ID not found");
  }

  const response = await apiClient.get(
    `/store_svc/v1/stores/${uuid}/categories/${categoryId}`
  );

  return response.data as any;
};

export const searchCategories = async ({
  page = 0,
  size = 10,
  searchTerm = "",
}: CategorySearchParams): Promise<CategorySearchResponse> => {
  const user = Cookies.get("user");
  const uuid = user ? JSON.parse(user).uuid : "";

  if (!uuid) {
    throw new Error("Store ID not found");
  }

  const searchParams = {
    request: searchTerm ? [{ key: "name", value: searchTerm }] : [],
    pageRequest: {
      page,
      size,
    },
  };

  const response = await apiClient.put(
    `/store_svc/v1/stores/${uuid}/categories/search`,
    searchParams
  );

  return {
    categories: response.data.response || [],
    total_count: response.data.page_response.total || 0,
    page_count: response.data.page_response.total || 0,
  };
};

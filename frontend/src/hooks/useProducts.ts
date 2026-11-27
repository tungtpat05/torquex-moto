import { useCallback, useEffect, useState } from "react";
import { Product } from "../types/product";
import { getProducts, getProductsByCategory } from "../services/productService";

interface UseProductsOptions {
  categoryId?: number;
}

export const useProducts = (options?: UseProductsOptions) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = options?.categoryId
        ? await getProductsByCategory(options.categoryId)
        : await getProducts();

      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load products";
      setError(errorMessage);
      console.error("useProducts error:", err);
    } finally {
      setLoading(false);
    }
  }, [options?.categoryId]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

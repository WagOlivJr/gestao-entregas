import type { Product } from "../Product";
import { createModuleListContext } from "../../../shared/contexts/moduleListContext/module-list-context";

export const [ProductsListProvider, useProductsListActions] =
    createModuleListContext<Product>("ProductsList");

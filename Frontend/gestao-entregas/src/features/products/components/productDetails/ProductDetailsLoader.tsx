import type { Product } from "../../Product";
import { useAsyncResource } from "../../../../shared/hooks/useAsyncResource";
import { productsService } from "../../services/productsService";
import { InlineError } from "../../../../shared/components/inlineError/InlineError";
import { Skeleton } from "../../../../shared/components/skeleton/Skeleton";
import { ProductDetails } from "./ProductDetails";

interface Props {
    productId: number;
    initialProduct?: Product;
    onEdit: (product: Product) => void;
    onSuccess: () => void;
}

export function ProductDetailsLoader({
    productId,
    initialProduct,
    onEdit,
    onSuccess,
}: Props) {
    const { data, loading, error, reload } = useAsyncResource(
        (signal) => productsService.getById(productId, signal),
        [productId],
    );

    const product = data ?? initialProduct ?? null;
    if (!product && loading) return <ProductDetailsSkeleton />;
    if (!product && error) {
        return (
            <InlineError
                error={error}
                title="Não foi possível carregar os detalhes..."
                onRetry={reload}
            />
        );
    }
    if (product)
        return (
            <ProductDetails
                product={product}
                onEdit={onEdit}
                onSuccess={onSuccess}
            />
        );
}

function ProductDetailsSkeleton() {
    return (
        <Skeleton
            ariaLabel="Carregando detalhes do produto"
            sections={[
                { lines: ["40%", "65%"] },
                { title: true, lines: ["35%", "80%", "72%"] },
                { title: true, lines: ["58%", "52%"] },
            ]}
        />
    );
}

import type { PagedResponse } from "../../types/page";

export function mapPagedResponse<TDto, TDomain>(
    page: PagedResponse<TDto>,
    mapper: (item: TDto) => TDomain,
): PagedResponse<TDomain> {
    return {
        ...page,
        content: page.content.map(mapper),
    };
}

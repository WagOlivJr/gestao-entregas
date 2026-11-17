import type { User } from "../../User";
import { useAsyncResource } from "../../../../shared/hooks/useAsyncResource";
import { usersService } from "../../services/usersService";
import { InlineError } from "../../../../shared/components/inlineError/InlineError";
import { Skeleton } from "../../skeleton/Skeleton";
import { UserDetails } from "./UserDetails";

interface Props {
    userId: number;
    initialUser?: User;
}

export function UserDetailsLoader({ userId, initialUser }: Props) {
    const { data, loading, error, reload } = useAsyncResource(
        (signal) => usersService.getById(userId, signal),
        [userId],
    );

    const user = data ?? initialUser ?? null;
    if (!user && loading) return <UserDetailsSkeleton />;
    if (!user && error) {
        return (
            <InlineError
                error={error}
                title="Não foi possível carregar os detalhes..."
                onRetry={reload}
            />
        );
    }
    if (user) return <UserDetails user={user} />;
}

function UserDetailsSkeleton() {
    return (
        <Skeleton
            ariaLabel="Carregando detalhes do usuário"
            sections={[
                { lines: ["15%", "40%", "65%"] },
                { title: true, lines: ["52%"] },
            ]}
        />
    );
}

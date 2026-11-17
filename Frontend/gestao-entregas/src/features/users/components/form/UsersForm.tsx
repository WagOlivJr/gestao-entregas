import { useState, type SubmitEvent } from "react";

interface InvitationFormData {
    boundEmail: string;
    role: string;
}

interface Props {
    onCancel: () => void;
    onSaved?: () => void;
}

export function UsersForm({ onSaved, onCancel }: Props) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const invitationPayload = Object.fromEntries(
            new FormData(event.currentTarget).entries(),
        );

        try {
        } catch (e) {}
    }

    return <></>;
}

import type { User } from "../../User";
import { UsersActions } from "../usersActions/UsersActions";

const STATUS_LABEL = {
    ACTIVE: "Ativo",
    BANNED: "Banido",
    SUSPENDED: "Suspenso",
};

export function UserDetails({ user }: { user: User }) {
    return (
        <>
            <div className="modal__body">
                <div className="modal__main-content">
                    <section className="modal__section">
                        <p>
                            <strong>Id: </strong>
                            {user.id}
                        </p>
                        <p>
                            <strong>Nome: </strong>
                            {user.username}
                        </p>
                        <p>
                            <strong>E-mail: </strong>
                            {user.email}
                        </p>
                    </section>

                    <section className="modal__section">
                        <h3 className="modal__section-title">Acesso</h3>
                        <p>
                            <strong>Status: </strong>
                            <span
                                className="status-badge modal__item-status-inline"
                                data-status={user.status}
                            >
                                {STATUS_LABEL[user.status]}
                            </span>
                        </p>
                    </section>
                </div>
            </div>
            <div className="app-dialog__actions">
                <UsersActions user={user} isModal={true} />
            </div>
        </>
    );
}

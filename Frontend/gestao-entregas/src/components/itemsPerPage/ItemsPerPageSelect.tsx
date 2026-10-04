import { useShallow } from "zustand/shallow";
import { useItemsPerPageStore } from "../../stores/itemsPerPageStore";
import "./ItemsPerPageSelect.css";

const OPTIONS = [5, 10, 20, 50, 100];

export function ItemsPerPageSelect() {
    const { itemsPerPage, setItemsPerPage } = useItemsPerPageStore(
        useShallow((state) => ({
            itemsPerPage: state.itemsPerPage,
            setItemsPerPage: state.setItemsPerPage,
        })),
    );

    return (
        <div className="items-per-page-container" id="items-per-page-container">
            <label htmlFor="items-per-page">Itens por página</label>
            <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="items-per-page-select"
            >
                {OPTIONS.map((op) => (
                    <option key={op} value={op}>
                        {op}
                    </option>
                ))}
            </select>
        </div>
    );
}

import { createModuleListContext } from "../../../shared/contexts/moduleListContext/module-list-context";
import type { Delivery } from "../types/delivery";

export const [DeliveriesListProvider, useDeliveriesListActions] =
    createModuleListContext<Delivery>("DeliveriesList");

import { createModuleListContext } from "../../../../../shared/contexts/moduleListContext/module-list-context";
import type { Customer } from "../../../Customer";

export const [CustomersListProvider, useCustomersListActions] =
    createModuleListContext<Customer>("CustomersList");

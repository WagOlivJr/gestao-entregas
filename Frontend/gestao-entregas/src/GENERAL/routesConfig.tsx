import React, { type ComponentType, type LazyExoticComponent } from "react";
import { UserRole } from "../entities/User";

export interface RouteConfig {
    path: string;
    label?: string;
    moduleTitle?: string;
    component: LazyExoticComponent<ComponentType> | ComponentType;
    requiresAuth?: boolean;
    allowedRoles?: UserRole[];
}

export const routesConfig: RouteConfig[] = [
    {
        path: "login",
        // label: "Login",
        component: lazyNamed(() => import("../pages/Login"), "Login"),
    },
    {
        path: "home",
        label: "Home",
        moduleTitle: "Gestão de Entregas - Página Inicial",
        component: lazyNamed(() => import("../pages/Home"), "Home"),
        requiresAuth: true,
    },
    {
        path: "produtos",
        label: "Produtos",
        moduleTitle: "Gerenciamento de Produtos",
        component: lazyNamed(
            () => import("../pages/products/Products"),
            "Products",
        ),
        requiresAuth: true,
    },
    {
        path: "clientes",
        label: "Clientes",
        moduleTitle: "Gerenciamento de Clientes",
        component: lazyNamed(
            () => import("../pages/customers/Customers"),
            "Customers",
        ),
        requiresAuth: true,
    },
    {
        path: "entregas",
        label: "Entregas",
        moduleTitle: "Gerenciamento de Entregas",
        component: lazyNamed(
            () => import("../pages/deliveries/Deliveries"),
            "Deliveries",
        ),
        requiresAuth: true,
    },
    {
        path: "usuarios",
        label: "Usuários",
        moduleTitle: "Gerenciamento de Usuários",
        component: lazyNamed(() => import("../pages/users/Users"), "Users"),
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    {
        path: "meu-usuario",
        label: "Meu Usuário",
        component: lazyNamed(() => import("../pages/users/Users"), "Users"),
        requiresAuth: true,
    },
    {
        path: "sobre",
        label: "Sobre",
        component: lazyNamed(() => import("../pages/About"), "About"),
        requiresAuth: true,
    },
];

function lazyNamed<K extends string>(
    factory: () => Promise<Record<K, ComponentType>>,
    name: K,
): LazyExoticComponent<ComponentType> {
    return React.lazy(() =>
        factory().then((module) => ({ default: module[name] })),
    );
}

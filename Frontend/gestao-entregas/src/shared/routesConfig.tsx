import React, { type ComponentType, type LazyExoticComponent } from "react";
import { UserRole } from "../features/users/User";

export interface RouteConfig {
    path: string;
    label?: string;
    component: LazyExoticComponent<ComponentType> | ComponentType;
    requiresAuth?: boolean;
    allowedRoles?: UserRole[];
}

export const routesConfig: RouteConfig[] = [
    {
        path: "login",
        // label: "Login",
        component: lazyNamed(() => import("../features/login/Login"), "Login"),
    },
    {
        path: "home",
        label: "Home",
        component: lazyNamed(() => import("../features/home/Home"), "Home"),
        requiresAuth: true,
    },
    {
        path: "produtos",
        label: "Produtos",
        component: lazyNamed(
            () => import("../features/products/ProductsPage"),
            "ProductsPage",
        ),
        requiresAuth: true,
    },
    {
        path: "clientes",
        label: "Clientes",
        component: lazyNamed(
            () => import("../features/customers/CustomersPage"),
            "CustomersPage",
        ),
        requiresAuth: true,
    },
    {
        path: "entregas",
        label: "Entregas",
        component: lazyNamed(
            () => import("../features/deliveries/DeliveriesPage"),
            "DeliveriesPage",
        ),
        requiresAuth: true,
    },
    {
        path: "usuarios",
        label: "Usuários",
        component: lazyNamed(
            () => import("../features/users/UsersPage"),
            "UsersPage",
        ),
        requiresAuth: true,
        allowedRoles: [UserRole.ADMIN],
    },
    {
        path: "meu-usuario",
        label: "Meu Usuário",
        component: lazyNamed(
            () => import("../features/users/UsersPage"),
            "UsersPage",
        ),
        requiresAuth: true,
    },
    {
        path: "sobre",
        label: "Sobre",
        component: lazyNamed(() => import("../features/about/About"), "About"),
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

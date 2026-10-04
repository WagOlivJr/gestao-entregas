import { Navigate, Route } from "react-router-dom";
import "./App.css";
import { BrowserRouter, Routes } from "react-router-dom";
import { Header } from "./components/header/Header";
import { Footer } from "./components/footer/Footer";
import { routesConfig } from "./GENERAL/routesConfig";
import { ModuleLayout } from "./components/layout/ModuleLayout";
import { RequireAuth } from "./components/RequireAuth";
import { ItemsPerPageSelect } from "./components/itemsPerPage/ItemsPerPageSelect";

function App() {
    return (
        <BrowserRouter>
            <Header
                links={routesConfig
                    .filter((route) => route.label)
                    .map(({ path, label, allowedRoles }) => ({
                        path,
                        label,
                        allowedRoles,
                    }))}
            />
            <Routes>
                {routesConfig.map(
                    ({
                        path,
                        component: Component,
                        moduleTitle,
                        requiresAuth,
                        allowedRoles,
                    }) => (
                        <Route
                            key={path}
                            path={`/${path}`}
                            element={
                                <ModuleLayout title={moduleTitle}>
                                    {!requiresAuth ? (
                                        <Component />
                                    ) : (
                                        <RequireAuth
                                            allowedRoles={allowedRoles}
                                        >
                                            <Component />
                                        </RequireAuth>
                                    )}
                                </ModuleLayout>
                            }
                        />
                    ),
                )}
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
            <ItemsPerPageSelect />
            <Footer />
        </BrowserRouter>
    );
}

export default App;

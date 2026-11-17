import { Navigate, Route } from "react-router-dom";
import "./App.css";
import { BrowserRouter, Routes } from "react-router-dom";
import { Header } from "./shared/components/header/Header";
import { Footer } from "./shared/components/footer/Footer";
import { routesConfig } from "./shared/routesConfig";
import { ItemsPerPageSelect } from "./shared/components/itemsPerPage/ItemsPerPageSelect";
import { DialogProvider } from "./shared/components/dialog/DialogProvider";
import { GlobalLoadingIndicator } from "./shared/components/loadingSpinner/GlobalLoadingIndicator";
import { RequireAuth } from "./shared/components/RequireAuth";
import { AppErrorBoundary } from "./shared/components/error/error-boundary/AppErrorBoundary";

function App() {
    return (
        <AppErrorBoundary>
            <DialogProvider>
                <GlobalLoadingIndicator />
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
                                requiresAuth,
                                allowedRoles,
                            }) => (
                                <Route
                                    key={path}
                                    path={`/${path}`}
                                    element={
                                        !requiresAuth ? (
                                            <Component />
                                        ) : (
                                            <RequireAuth
                                                allowedRoles={allowedRoles}
                                            >
                                                <Component />
                                            </RequireAuth>
                                        )
                                    }
                                />
                            ),
                        )}
                        <Route
                            path="*"
                            element={<Navigate to="/home" replace />}
                        />
                    </Routes>
                    <ItemsPerPageSelect />
                    <Footer />
                </BrowserRouter>
            </DialogProvider>
        </AppErrorBoundary>
    );
}

export default App;

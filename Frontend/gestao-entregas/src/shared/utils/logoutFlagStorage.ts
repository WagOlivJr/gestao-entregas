const LOGGED_OUT_FLAG = "spa_logged_out";

export const logoutFlagStorage = {
    setLogoutFlag: () => localStorage.setItem(LOGGED_OUT_FLAG, "true"),
    clearLogoutFlag: () => localStorage.removeItem(LOGGED_OUT_FLAG),
    hasLogoutFlag: (): boolean =>
        localStorage.getItem(LOGGED_OUT_FLAG) === "true",
};

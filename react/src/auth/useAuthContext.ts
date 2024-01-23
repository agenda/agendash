import { useContext } from "react";
import { AuthContext } from "./Auth";

export const useAuthContext = () => useContext(AuthContext);

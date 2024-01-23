import { LoginInput, login } from "apis";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken, clearToken, setToken } from "services/token";

interface AuthProvider {
  isAuthenticated: boolean;
  signin(input: LoginInput): Promise<any>;
  signout(): void;
}

export const AuthContext = createContext<AuthProvider>({
  isAuthenticated: false,
  signin: async (input: LoginInput) => {
    console.log(input);
  },
  signout: () => undefined,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const signin = async (input: LoginInput) => {
    const data = await login(input);

    setToken(data.token);
    setIsAuthenticated(true);
    navigate("/");
  };
  const signout = () => {
    setIsAuthenticated(false);
    clearToken();
    navigate("/login");
  };

  useEffect(() => {
    if (checkToken()) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(true);
      navigate("/login");
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

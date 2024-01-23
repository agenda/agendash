import { useMutation } from "@tanstack/react-query";
import { LoginInput } from "../../apis";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Text, TextField } from "@radix-ui/themes";
import { useAuthContext } from "auth/useAuthContext";

const LoginPage = () => {
  const { signin, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState<LoginInput>({
    username: "",
    password: "",
  });

  const { mutate, isError } = useMutation({
    mutationFn: signin,
  });

  const handleSubmit = () => {
    mutate(loginForm);
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate, isAuthenticated]);

  return (
    <div className="flex justify-center">
      <Card className="w-1/3 mt-10">
        <h1 className="text-xl font-bold">Login</h1>
        <div className="mt-3">
          <span className="text-sm font-bold">Email:</span>
          <TextField.Input
            placeholder="Username"
            type="text"
            value={loginForm.username}
            onChange={(e) =>
              setLoginForm({ ...loginForm, username: e.target.value })
            }
          />
        </div>
        <div className="mt-3">
          <span className="text-sm font-bold">Password:</span>
          <TextField.Input
            placeholder="Password"
            type="password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
          />
        </div>
        <Button onClick={handleSubmit} className="mt-3">
          Submit
        </Button>
        {isError && (
          <Text color="red" as="p">
            Email or Password incorrect
          </Text>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;

import { Button, Heading } from "@radix-ui/themes";
import { useAuthContext } from "auth/useAuthContext";
import { Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signout } = useAuthContext();
  const goToOverviewPage = () => {
    navigate("/");
  };

  return (
    <>
      <header className="h-[50px] border-b-2 flex items-center justify-between px-3">
        <Heading className="cursor-pointer" onClick={goToOverviewPage}>
          Ekino Agendash
        </Heading>
        {isAuthenticated && <Button onClick={signout}>Logout</Button>}
      </header>
      <main className="bg-gray-50 min-h-[calc(100vh_-_50px)] p-4">
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;

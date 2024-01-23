import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "./assets/styles/tailwind.css";

const UN_AUTHENTICATION_CODE = 401;

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error: any) {
      if (error.response?.status === UN_AUTHENTICATION_CODE) {
        window.location.reload();
      }
    },
  }),
  mutationCache: new MutationCache({
    onError(error: any) {
      if (error.response?.status === UN_AUTHENTICATION_CODE) {
        window.location.reload();
      }
    },
  }),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Theme>
        <App />
      </Theme>
    </QueryClientProvider>
  </React.StrictMode>
);

import "./universal.css";

import { Auth } from "@supabase/auth-ui-react";
import { createClient } from "@supabase/supabase-js";
import React from "react";
import ReactDOM from "react-dom/client";
import invariant from "tiny-invariant";
import App from "./App";
import { Database } from "./_types";

invariant(process.env.REACT_APP_SUPABASE_URL);
invariant(process.env.REACT_APP_SUPABASE_KEY);

const supabase = createClient<Database>(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Auth.UserContextProvider supabaseClient={supabase}>
      <App supabaseClient={supabase} />
    </Auth.UserContextProvider>
  </React.StrictMode>
);

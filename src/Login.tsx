import "./Login.css";

import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { SupabaseClient } from "@supabase/supabase-js";

const Login = ({ supabaseClient }: { supabaseClient: SupabaseClient }) => (
  <div className="login">
    <h1>Geostrategic</h1>
    <Auth supabaseClient={supabaseClient} appearance={{ theme: ThemeSupa }} />
  </div>
);

export default Login;

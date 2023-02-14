import { Auth } from "@supabase/auth-ui-react";
import { SupabaseClient } from "@supabase/supabase-js";
import Game from "./Game";
import Login from "./Login";
import { Database } from "./_types";

import "./App.css";

// Despite what they've called this, it in fact returns the session object.
const useSession = Auth.useUser;

const App = ({
  supabaseClient,
}: {
  supabaseClient: SupabaseClient<Database>;
}) => {
  const session = useSession();
  return session.user ? (
    <Game supabaseClient={supabaseClient} user={session.user} />
  ) : (
    <Login supabaseClient={supabaseClient} />
  );
};

export default App;

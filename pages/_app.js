import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { DataProvider } from "../store/globalState";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </SessionProvider>
  );
}

export default App;

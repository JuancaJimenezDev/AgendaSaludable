// src/pages/_app.tsx
import Layout from "@/app/layout";
import type { AppProps } from "next/app";
import "../globals.css"; // Importa tus estilos globales

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

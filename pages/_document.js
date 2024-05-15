import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-menu">
            <div class="navbar-brand">
              <a class="navbar-item" href="/">
                Accueil
              </a>
            </div>
          </div>
        </nav>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

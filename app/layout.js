export const metadata = {
  title: "FrogPass — TCU Athletics",
  description: "AI-Powered Student Attendance Engine for TCU Athletics",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0A0A12" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐸</text></svg>" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0A0A12", overscrollBehavior: "none" }}>
        {children}
      </body>
    </html>
  );
}

export const metadata = {
  title: "FrogPass Demo",
  description: "FrogPass demo application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

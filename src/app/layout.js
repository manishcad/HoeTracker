import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "HoeTracker",
  description: "Keep Track Without Losing Track.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ProductionDiagnostic from "@/components/ProductionDiagnostic";

export const metadata: Metadata = {
  title: "Capgemini Essay Writing Tutor",
  description: "Professional essay analysis and writing improvement platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <ProductionDiagnostic />
        </AuthProvider>
      </body>
    </html>
  );
}

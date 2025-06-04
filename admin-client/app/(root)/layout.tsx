import AdminSidebar from "@/components/layout/AdminSidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="w-full flex h-screen grainy overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 ml-auto transition-all m-3.5 bg-white shadow-md rounded-lg">
          <main>{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}

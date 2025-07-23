import MainNavbar from "@/components/layout/MainNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full overflow-x-hidden">
      <MainNavbar />
      <main className="w-full mt-16">{children}</main>
    </div>
  );
}

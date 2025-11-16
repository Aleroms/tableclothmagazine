import Sidebar from "../ui/dashboard/sidebar";
import DashboardMobileMenu from "../ui/dashboard/dashboardMobileMenu";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Dashboard Mobile Menu - Visible on mobile, hidden on medium screens and up */}
      <div className="md:hidden">
        <DashboardMobileMenu />
      </div>

      {/* Sidebar - Hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

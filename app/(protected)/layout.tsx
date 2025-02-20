import { UserButton } from "@/components/auth/user-button";
import { AppSidebar } from "../../components/app-sidebar";
import { SidebarProvider } from "../../components/ui/sidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="h-[100vh] overflow-hidden flex flex-col  w-full p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))">
        <div className="flex justify-end mb-2">
          <UserButton />
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </SidebarProvider>
  );
};

export default ProtectedLayout;

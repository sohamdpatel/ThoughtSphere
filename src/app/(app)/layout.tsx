
import { cn } from "@/lib/utils";
import SideBarMain from "@/components/SidebarMain";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
          <div
            className={cn(
              "flex w-full flex-1 flex-col overflow-hidden h-screen rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
            )}
          > 
            <SideBarMain />
            {children}
          </div>    
  );
}

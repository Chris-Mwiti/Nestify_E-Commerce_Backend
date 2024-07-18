import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import SearchModal from '@/layouts/components/search.modal';
import { Link, Outlet } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns';
import { Activity, Boxes, Home, Library, LogOut, LucideIcon, Receipt, Store } from 'lucide-react';

export const Route = createFileRoute('/_mainLayout')({
  component: () => <div>Hello /_mainLayout!</div>
})

type TSideBarLinks = {
  title: string;
  icon: LucideIcon;
  path: string;
};

const DefaultLayout = () => {
  const currDate = format(new Date(), "eeee do MMMM yyyy");
  const sideBarLinks: TSideBarLinks[] = [
    {
      title: "Home",
      icon: Home,
      path: "/",
    },
    {
      title: "Shop",
      icon: Store,
      path: "/shop",
    },
    {
      title: "Orders",
      icon: Receipt,
      path: "/orders",
    },
    {
      title: "Products",
      icon: Boxes,
      path: "/products",
    },
    {
      title: "Categories",
      icon: Library,
      path: "/category",
    },
    {
      title: "Analytics",
      icon: Activity,
      path: "/analytics",
    },
  ];
  return (
    <div className="w-dvw h-dvh">
      <ResizablePanelGroup
        className="w-full h-full border dark dark:bg-background"
        direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={20} maxSize={20}>
          <div className="w-full flex  flex-col space-y-6 items-center justify-center p-3">
            <span className="flex flex-col space-y-2">
              <p className="font-semibold text-lg text-foreground">
                Automotive POS
              </p>
              <p className="text-muted-foreground font-medium">{currDate}</p>
            </span>
            {sideBarLinks.map((link) => (
              <Link to={link.path} className="w-full">
                {({ isActive }) => (
                  <span
                    className={`w-full flex items-center space-x-3  rounded-md p-2 cursor-pointer hover:bg-primary/15 transition-colors ease-in delay-100 duration-75 ${isActive ? "bg-primary/15" : ""}`}>
                    <link.icon className="stroke-primary size-5" />
                    <p className="text-lg font-semibold text-foreground">
                      {link.title}
                    </p>
                  </span>
                )}
              </Link>
            ))}
            <Button
              variant={"ghost"}
              className="w-full justify-start p-2 text-foreground">
              <LogOut className="mr-3 stroke-muted-foreground" />
              Logout
            </Button>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80} minSize={80}>
          <div className="w-full max-h-full flex flex-col relative space-y-4 overflow-hidden">
            <div className="w-full p-3 flex items-center justify-between border drop-shadow-sm">
              {/* Search bar */}
              <SearchModal />
              <Link to="/profile">
                {({ isActive }) => (
                  <Button
                    variant={"ghost"}
                    className={`flex space-x-3 h-max ${isActive ? "bg-primary/15" : ""}`}>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CM</AvatarFallback>
                    </Avatar>
                    <span className="flex flex-col space-y-1">
                      <p className="text-lg text-muted-foreground font-semibold">
                        Chris Mwiti
                      </p>
                      <p className="text-sm text-foreground font-semibold text-start">
                        cashier
                      </p>
                    </span>
                  </Button>
                )}
              </Link>
            </div>
            <div
              className="w-full min-h-full overflow-y-auto text-foreground flex-1
              xl:p-4
            ">
              <Outlet />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

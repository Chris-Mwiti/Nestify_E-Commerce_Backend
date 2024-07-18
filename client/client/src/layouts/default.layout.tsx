import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Link, Outlet } from "@tanstack/react-router";
import {
  Activity,
  Boxes,
  Home,
  Library,
  LogOut,
  LucideIcon,
  Receipt,
  Store,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import SearchModal from "./components/search.modal";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**@todo: Enable the sidebar to be able to be resizable
 * @todo: Improve the search modal to support dynamic search results: (modal...)
 */

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
      <SignedOut>
        <div className="w-full h-full bg-background flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>AUTOMATIVE POS</CardTitle>
              <CardDescription>
                Welcome back!!! Please login back to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInButton>
                <Button className="w-full">Sign in</Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </SignedOut>
      <SignedIn>
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
                <UserButton />
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
      </SignedIn>
      
    </div>
  );
};

export default DefaultLayout;

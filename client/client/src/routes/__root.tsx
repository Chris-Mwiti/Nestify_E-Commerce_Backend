import DefaultLayout from "@/layouts/default.layout";
import { createRootRoute} from "@tanstack/react-router";

export const Route  = createRootRoute({
    component: DefaultLayout
})
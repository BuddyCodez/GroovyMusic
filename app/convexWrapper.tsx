"use client"
import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/clerk-react";
import { ConvexClientProvider } from "@/hooks/use-convex-client";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
function ConvexWrapper({ children }: { children: React.ReactNode }) {
    return (
        // <ConvexProviderWithClerk client={convex} >
        //     <ConvexClientProvider>
        //         {children}
        //     </ConvexClientProvider>
        // </ConvexProviderWithClerk>
        <></>
    );
}
export { ConvexWrapper };
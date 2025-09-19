"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, useUser } from "@clerk/nextjs";
import { SchematicProvider, useSchematicEvents } from "@schematichq/schematic-react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const SchematicWapped = ({ children }: { children: React.ReactNode }) => {
  const { identify } = useSchematicEvents();
  const { user } = useUser();

  useEffect(() => {
    const username = user?.fullName ?? user?.username ?? user?.emailAddresses[0]?.emailAddress ?? user?.id;
    if (user?.id) {
      identify({
        // Add properties as needed, e.g. id: user.id, name: username
        name:username,
        keys:{
          id:user.id,
        },
        company:{
          keys:{
            id:user.id,
          },
          name:username,
        }
      });
    }
  }, [user, identify]);

  return <>{children}</>;
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>

      <SchematicProvider publishableKey={process.env.NEXT_PUBLIC_SCHEMATIC_KEY!}>
        <SchematicWapped>
          {children}
        </SchematicWapped>
      </SchematicProvider>

    </ConvexProviderWithClerk>
  )
}

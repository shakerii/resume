import { AdminFrame } from "~/components/forms/admin-frame";
import type { Metadata } from "next";
import { TrpcProvider } from "~/trpc/react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrpcProvider>
      <AdminFrame>{children}</AdminFrame>
    </TrpcProvider>
  );
}

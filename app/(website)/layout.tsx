import SiteChrome from "@/components/siteChrome";
import JsonLd from "@/components/jsonLd";
import { organizationSchema } from "@/lib/schema";

export default function Layout({ children }) {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <SiteChrome>{children}</SiteChrome>
    </>
  );
}

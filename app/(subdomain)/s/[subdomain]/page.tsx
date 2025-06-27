import { db } from "@/db";
import { blogTable } from "@/db/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
interface Params {
  subdomain: string;
}
export default async function Page({ params }: { params: Promise<Params> }) {
  const { subdomain } = await params;
  const client = await clerkClient();
  const org = await client.organizations.getOrganization({ slug: subdomain });
  const orgId = org.id;

  const blogs = await db
    .select()
    .from(blogTable)
    .where(eq(blogTable.orgId, orgId));

  return (
    <div>
      {blogs.map((blog, index) => (
        <div key={index}>
          <h3>{blog.title}</h3>
          <p>{blog.body}</p>
        </div>
      ))}
    </div>
  );
}

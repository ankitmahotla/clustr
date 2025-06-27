"use client";
import Nav from "@/components/nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { createBlog } from "./actions";
import { useOrganization } from "@clerk/nextjs";

export default function OrgLandingPage() {
  const [blogContent, setBlogContent] = React.useState("");
  const [blogTitle, setBlogTitle] = React.useState("");

  const selectedOrg = useOrganization();

  const handleCreateBlog = async () => {
    if (!selectedOrg.organization?.id) return;
    await createBlog({
      body: blogContent.trim(),
      orgId: selectedOrg.organization?.id,
      title: blogTitle.trim(),
    });
  };
  return (
    <main>
      <Nav />
      <div className="p-10">
        <Input
          placeholder="Enter your blog title"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />
        <Textarea
          placeholder="Enter your blog content"
          value={blogContent}
          onChange={(e) => setBlogContent(e.target.value)}
          className="mt-2"
        />
        <Button onClick={handleCreateBlog} className="mt-2">
          Create Blog
        </Button>
      </div>
    </main>
  );
}

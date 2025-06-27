"use client";

import Nav from "@/components/nav";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { createBlog } from "./actions";
import { useOrganization } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Tiptap } from "@/components/tiptap";
import { Toolbar } from "@/components/toolbar";
import { useEditorStore } from "@/store/editor";

export default function OrgLandingPage() {
  const { editor } = useEditorStore();
  const [loading, setLoading] = React.useState(false);

  const selectedOrg = useOrganization();

  const handleCreateBlog = async () => {
    if (!editor) {
      toast.error("Editor not ready");
      return;
    }

    const html = editor.getHTML();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const titleElement = tempDiv.querySelector("h1");
    const title = titleElement?.innerText || "";
    titleElement?.remove();

    const body = tempDiv.innerHTML;

    if (!title.trim() || !body.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    if (!selectedOrg.organization?.id) {
      toast.error("Organization not selected");
      return;
    }

    setLoading(true);
    try {
      await createBlog({
        title: title.trim(),
        body: body.trim(),
        orgId: selectedOrg.organization.id,
      });
      toast.success("Blog created");
      editor.commands.clearContent();
    } catch (error) {
      toast.error("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col px-4 pt-2 print:hidden">
        <Nav />
        {selectedOrg.organization?.id && (
          <div className="flex flex-col items-center justify-center">
            <div className="md:w-[816px]">
              <Toolbar />
            </div>
          </div>
        )}
      </div>
      {selectedOrg.organization?.id ? (
        <>
          <div className="print:pt-0">
            <Tiptap />
          </div>
          <div className="flex flex-col items-center justify-end">
            <div className="flex justify-end md:w-[816px]">
              <Button onClick={handleCreateBlog} disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Creating...
                  </span>
                ) : (
                  "Create Blog"
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-center text-muted-foreground text-lg mt-10">
            Please select an organization to post a blog.
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { useOrganizationList } from "@clerk/nextjs";
import { ChevronsUpDown, Plus } from "lucide-react";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TeamSwitcher() {
  const { userMemberships, setActive, isLoaded, createOrganization } =
    useOrganizationList({ userMemberships: true });

  const { isMobile } = useSidebar();
  const [activeOrgId, setActiveOrgId] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [orgName, setOrgName] = React.useState("");
  const [orgSlug, setOrgSlug] = React.useState("");

  React.useEffect(() => {
    if (isLoaded && userMemberships.data?.length > 0) {
      const currentOrgId = userMemberships.data[0].organization.id;
      setActiveOrgId(currentOrgId);
    }
  }, [isLoaded, userMemberships.data]);

  if (!isLoaded || !activeOrgId) return null;

  const activeMembership = userMemberships.data.find(
    (m) => m.organization.id === activeOrgId,
  );

  if (!activeMembership) return null;

  const renderLogo = (membership: typeof activeMembership) => {
    const org = membership.organization;
    return org.hasImage && org.imageUrl ? (
      <Image
        src={org.imageUrl}
        alt={org.name}
        width={24}
        height={24}
        className="rounded-md"
      />
    ) : (
      <span className="text-sm font-bold">{org.name[0]}</span>
    );
  };

  const handleCreateOrganization = async () => {
    if (!orgName.trim()) return;
    await createOrganization({ name: orgName, slug: orgSlug || undefined });
    userMemberships.revalidate();
    setDialogOpen(false);
    setOrgName("");
    setOrgSlug("");
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                  {renderLogo(activeMembership)}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {activeMembership.organization.name}
                  </span>
                  <span className="truncate text-xs">
                    {activeMembership.roleName}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Organizations
              </DropdownMenuLabel>
              {userMemberships.data.map((membership, index) => (
                <DropdownMenuItem
                  key={membership.organization.id}
                  onClick={async () => {
                    await setActive({
                      organization: membership.organization.id,
                    });
                    setActiveOrgId(membership.organization.id);
                  }}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-md border overflow-hidden">
                    {renderLogo(membership)}
                  </div>
                  {membership.organization.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDialogOpen(true)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Add organization
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Input
              placeholder="Organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
            <Input
              placeholder="Slug (optional)"
              value={orgSlug}
              onChange={(e) => setOrgSlug(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateOrganization}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

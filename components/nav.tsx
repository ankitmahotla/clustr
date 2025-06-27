import * as React from "react";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";

const Nav: React.FC = () => {
  return (
    <nav className="p-4 flex items-center justify-between">
      <div>
        <Link href="/">
          <h1 className="text-2xl font-bold">Clustr</h1>
        </Link>
      </div>
      <div className="flex gap-2 justify-center items-center">
        <OrganizationSwitcher afterSelectOrganizationUrl="/org/:slug" />
        <UserButton />
      </div>
    </nav>
  );
};

export default Nav;

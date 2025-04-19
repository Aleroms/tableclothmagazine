"use client";
import { User } from "@/app/lib/definitions";
import { useState } from "react";
import UserSelector from "./userSelector";
import UserDetails from "./userDetails";

interface userTeamPreviewProps {
  users: User[];
}

export default function UserTeamPreview({ users }: userTeamPreviewProps) {
  const [currentUser, setCurrentUser] = useState(users[0]);
  return (
    <div className="mx-3 my-10 md:flex md:gap-15 lg:gap-24 justify-center">
      <UserSelector
        users={users}
        currentUser={currentUser}
        onUserSelect={setCurrentUser}
      />
      <UserDetails user={currentUser} />
    </div>
  );
}

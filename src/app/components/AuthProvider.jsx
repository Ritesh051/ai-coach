"use client"
import { useUser } from '@stackframe/stack';
import { useMutation } from 'convex/react';
import { User } from 'lucide-react';

import React, { useEffect, useState } from 'react';


function AuthProvider({ children }) {
  const user = useUser();
  const createUser = useMutation(api.users.CreateUser);
  const [userData, setUserData] = useState();
  const CreateNewUser = async () => {
    if (!user) return;
    try {
      const result = await createUser({
        name: user.displayName,
        email: user.primaryEmail
      });
      console.log("Convex result:", result);
      setUserData(result);
    } catch (err) {
      console.error("Convex mutation failed:", err);
    }
  };

  useEffect(() => {
    console.log("Stack user:", user);
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  return <>
    <div>
      <UserContext.Provider value={{ user, userData, setUserData }}>
        {children}
      </UserContext.Provider>
    </div>
  </>;
}

export default AuthProvider;

"use client"

import { createContext, useContext } from "react"

const UserContext = createContext();

export const useUserInfo = () => useContext(UserContext);

export default UserContext;
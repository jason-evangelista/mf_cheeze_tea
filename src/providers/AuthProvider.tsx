import { PropsWithChildren } from "react";

type AuthProviderProps = PropsWithChildren;

const AuthProvider = ({ children }: AuthProviderProps) => {
  return <>{children}</>;
};

export default AuthProvider;

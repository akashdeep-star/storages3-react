import { useContext } from "react";
import { signInWithRedirect } from "aws-amplify/auth";
import { AuthContext, AuthStatus } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const authContext = useContext(AuthContext);

  const login = async () => {
    await signInWithRedirect({
      provider: {
        custom: "IAMIdC",
      },
    });
  };

  if (authContext.authStatus === AuthStatus.SignedIn) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <h1>SSO Log in</h1>
      <button onClick={login}>Log in with your Novartis account</button>
    </div>
  );
};

export default Login;
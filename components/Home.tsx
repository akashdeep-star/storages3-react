import { StorageBrowser } from '../components/StorageBrowser';
import { useContext} from "react";
import Loader from '../components/Loader';
import { AuthContext, AuthStatus } from "../contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";

const Home = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    await signOut();
    context.signOut();
    navigate("/login");
  };

  if (context.authStatus !== AuthStatus.SignedIn) {
    return <Navigate to="/login" />;
  }

  return (
<main>
        {/* <h1>Hello {user?.username}</h1>*/}
          <button onClick={logout}>Sign out</button> 
        {/* StorageBrowser Component */}
        <h2>Your Files</h2>
        <StorageBrowser />
</main>

  );
  return <Loader />;
};

export default Home;


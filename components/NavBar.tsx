import { Box } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext } from "react-router";

export default function NavBar() {
  const { isSignedIn, signIn, signOut, userName } =
    useOutletContext<AuthContext>();
  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (error) {
        console.log(`Puter signout Failed ${error}`);
      }
      return;
    }
    try {
      await signIn();
    } catch (error) {
      console.log(`Puter SignIn Failed ${error}`);
    }
    return;
  };

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className="name">Rommify</span>
          </div>
          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprise</a>
          </ul>
        </div>
        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">
                {userName ? `Hi ${userName}` : "SignedIn"}
              </span>

              <button onClick={handleAuthClick} className="btn">
                log Out
              </button>
            </>
          ) : (
            <>
              <Button onClick={handleAuthClick} size="sm" variant="ghost">
                log In
              </Button>

              <a href="#upload" className="cta">
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

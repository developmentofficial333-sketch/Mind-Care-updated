import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { logOut } from "../firebase/auth";

export default function AccountPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogOut() {
    await logOut();
    navigate("/");
  }

  return (
    <section className="bg-cream py-20">
      <Container className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-ink">You&apos;re logged in</h1>
        <p className="mt-2 text-sm text-ink-soft">{user?.email}</p>
        <Button variant="primary" className="mt-6" onClick={handleLogOut}>
          Log out
        </Button>
      </Container>
    </section>
  );
}

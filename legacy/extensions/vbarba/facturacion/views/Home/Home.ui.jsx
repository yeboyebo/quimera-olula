import { AppMenu, Container } from "@quimera/comps";
import Quimera, { useAppValue } from "quimera";

function Home() {
  const [{ menus }] = useAppValue();
  console.log("menus", menus);
  return (
    <Quimera.Template id="Home">
      <Container maxWidth="md" className="container">
        <AppMenu structure={menus?.app} />
      </Container>
    </Quimera.Template>
  );
}

export default Home;

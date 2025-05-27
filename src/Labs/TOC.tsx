import Nav from "react-bootstrap/Nav";
import { Link, useLocation } from "react-router-dom";
export default function TOC() {
  const { pathname } = useLocation();
 return (
   <Nav variant="pills">
     <Nav.Item>
       <Nav.Link to="/Labs/Lab1" as={Link} active={pathname.includes("Lab1")}>Lab 1</Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link to="/Labs/Lab2" as={Link} active={pathname.includes("Lab2")}>Lab 2</Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link to="/Labs/Lab3" as={Link} active={pathname.includes("Lab3")}>Lab 3</Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link to="/Labs/Lab4" as={Link} active={pathname.includes("Lab4")}>Lab 4</Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link to="/Labs/Lab5" as={Link} active={pathname.includes("Lab5")}>Lab 5</Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link to="/Kambaz" as={Link}>Kambaz</Nav.Link>
     </Nav.Item>
     <Nav.Item>
       <Nav.Link href="https://github.com/zda58/wd-final-web-app" id="wd-github">My GitHub</Nav.Link>
     </Nav.Item>
   </Nav>
);}

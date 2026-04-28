import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav>
      <div>
        <Link to="/">Home</Link>
        <Link to="/todo">Todo</Link>
        <Link to="/address-book">Address Book</Link>
      </div>
    </nav>
  );
}

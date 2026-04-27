import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav
      style={{
        background: "#333",
        padding: "10px 20px",
        marginBottom: "20px",
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none", fontSize: "16px" }}
        >
          Home
        </Link>
        <Link
          to="/todo"
          style={{ color: "white", textDecoration: "none", fontSize: "16px" }}
        >
          Todo
        </Link>
        <Link
          to="/address-book"
          style={{ color: "white", textDecoration: "none", fontSize: "16px" }}
        >
          Address Book
        </Link>
      </div>
    </nav>
  );
}

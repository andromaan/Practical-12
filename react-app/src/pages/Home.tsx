import "../styles/pages.css";

export default function Home() {
  return (
    <div className="page-container">
      <h1>Home</h1>
      <p>Welcome to the application!</p>
      <p>Use the navigation menu to browse different sections:</p>
      <ul>
        <li>
          <strong>Home</strong> - This page
        </li>
        <li>
          <strong>Todo</strong> - Manage your tasks
        </li>
        <li>
          <strong>Address Book</strong> - Manage your contacts
        </li>
      </ul>
    </div>
  );
}

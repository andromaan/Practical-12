export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
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

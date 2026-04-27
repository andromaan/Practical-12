import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import AccessibilityManager from "./components/AccessibilityManager";
import Home from "./pages/Home";
import Todo from "./pages/Todo";
import AddressBook from "./pages/AddressBook";
import "./App.css";

function App() {
  return (
    <div>
      <AccessibilityManager />
      <Navigation />
      <Routes>
        <Route index handle={{title: "Home"}} path="/" element={<Home />} />
        <Route handle={{title: "Todo"}} path="/todo" element={<Todo />} />
        <Route handle={{title: "Address Book"}} path="/address-book" element={<AddressBook />} />
      </Routes>
    </div>
  );
}

export default App;

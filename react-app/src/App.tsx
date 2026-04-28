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
      <Navigation />
      <AccessibilityManager />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route
          path="/address-book"
          element={<AddressBook />}
        />
      </Routes>
    </div>
  );
}

export default App;

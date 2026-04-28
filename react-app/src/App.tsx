import { Route, Routes } from "react-router-dom";
import "./App.css";
import AddressBook from "./pages/AddressBook";
import Home from "./pages/Home";
import Todo from "./pages/Todo";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/address-book" element={<AddressBook />} />
      </Route>
    </Routes>
  );
}

export default App;

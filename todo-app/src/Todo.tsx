import TodoApp from "./TodoApp.tsx";
import Header from "./Header.tsx";
import List from "./List.tsx";
import Footer from "./Footer.tsx";
import Hint from "./Hint.tsx";

export default function Todo() {
  return (
    <>
      <TodoApp>
        <Header />
        <List />
        <Footer />
      </TodoApp>
      <Hint />
    </>
  );
}

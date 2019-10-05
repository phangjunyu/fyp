import React from "react";
import ReactDOM from "react-dom";
import Menu from "./components/menu";

function App() {
  return (
    <React.Fragment>
      <main className="container">
        <Menu
        //whatever props
        />
      </main>
    </React.Fragment>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<Menu />, rootElement);

export default App;

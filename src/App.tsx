import { view } from "react-easy-state";
import Calculator from "./components/Calculator";

const App = () => {
  return (
    <div>
      <h1>
        Made with ❤️ by Raz Buchnik
      </h1>
      <Calculator />
    </div>
  );
}

export default view(App)

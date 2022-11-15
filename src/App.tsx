import { view } from "react-easy-state";
import Calculator from "./components/Calculator";

const App = () => {
  return (
    <div>
      <Calculator />
    </div>
  );
}

export default view(App)

import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import './App.css';
import Companies from './components/Companies';
import Contracts from './components/Contracts';
import Users from './components/Users';

function App() {
  return (
    <div className="App">
      <Contracts></Contracts>
      <Companies></Companies>
      <Users></Users>
    </div>
  );
}

export default App;

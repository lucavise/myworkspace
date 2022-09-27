import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.material.blue.light.css';
import './App.css';
import Companies from './components/Companies';
import Contracts from './components/Contracts';
import Users from './components/Users';

function App() {
  return (
    <div className="contracts-app">
      <div className='section-sx'>
        <Contracts></Contracts>
      </div>
      <div className='section-dx'>
        <Companies></Companies>
        <Users></Users>
      </div>
    </div>
  );
}

export default App;

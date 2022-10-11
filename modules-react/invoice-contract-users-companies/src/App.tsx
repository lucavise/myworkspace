import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React from 'react';
import './App.css';
import { Companies } from './components/Companies';
import { Contracts } from './components/Contracts';
import { Users } from './components/Users';

function App() {
  return (
    <div className="App contracts-companies-users">
      <div className="ccu-sx">
        <Contracts></Contracts>
      </div>
      <div className="ccu-dx">
        <Companies></Companies>
        <Users></Users>
      </div>
    </div>
  );
}

export default App;

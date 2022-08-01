import React from 'react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import './App.css';
import Button from 'devextreme-react/button';

function App() {
  
  function sayHelloWorld() {
    alert('Hello world!')
  }

  return (
    <div className="App">
      <Button
        text="Click me"
        onClick={sayHelloWorld}
      />
    </div>
  );
}

export default App;
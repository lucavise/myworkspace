import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React from 'react';
import './App.css';

function App() {
  const w = window.open('https://www.google.com/', '_blank');
  if (w) {
    w.onbeforeunload = (event) => {
      const e = event || window.event;
      // Cancel the event
      e.preventDefault();
      if (e) {
        e.returnValue = ''; // Legacy method for cross browser support
      }
      return ''; // Legacy method for cross browser support
    };
  }

  var new_window = window.open('some url');
  if (new_window) {
    new_window.onbeforeunload = function () {
      /* my code */
    };
  }

  const handleWindow = () => {
    var popup = window.open('https://www.google.com/', '_blank');
    var timer = setInterval(function () {
      console.log('interval');
      if (popup && popup.closed) {
        clearInterval(timer);
        console.log('closed');
      }
    }, 1000);
    /*
    if (popup) {
      popup.onbeforeunload = function () {
        console.log('unload');
      };
    }
    */
  };

  return (
    <div className="App">
      contratti - aziende - utenti
      <div className="" onClick={handleWindow}>
        Ciao
      </div>
    </div>
  );
}

export default App;

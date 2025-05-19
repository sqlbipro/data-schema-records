
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);



// Remove dark mode class addition
//createRoot(document.getElementById("root")!).render(<App />);

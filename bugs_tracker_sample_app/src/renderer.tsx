require('bootstrap/dist/css/bootstrap.min.css')
import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './components/App'

document.addEventListener("DOMContentLoaded", () => {
  const rootNode = document.createElement('div')
  rootNode.id = 'root'
  document.body.appendChild(rootNode)

  // Now we can render our application into it
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
})

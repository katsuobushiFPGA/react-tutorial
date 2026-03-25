import { useState } from 'react'
import { sculptureList } from './data.js';
import './App.css'
import { Toolbar, Toolbar2, Toolbar3 } from './Toolbar.tsx'
import Gallery, { Gallery2 } from './Gallery.tsx';
import Form from './Form6.tsx'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Form />
    </>
  );
}


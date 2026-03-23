import { useState } from 'react'
import { sculptureList } from './data.js';
import './App.css'
import { Toolbar } from './Toolbar.tsx'
import Gallery from './Gallery.tsx';
import Form from './Form.tsx'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Toolbar
        onPlayMovie={(t) => alert(t + ' ' + 'Playing!')}
        onUploadImage={() => alert('Uploading!')}
      />
      <Gallery />
      <Form />
    </>
  );
}


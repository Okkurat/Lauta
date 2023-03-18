import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import Thread from './Thread';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:id" element={<Thread />} />
    </Routes>
  );
}

export default App;

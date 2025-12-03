import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Questions from './pages/Questions';
import Result from './pages/Result';
import Match from './pages/Match';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/questions" element={<Questions />} />
      <Route path="/result/:id" element={<Result />} />
      <Route path="/match/:type" element={<Match />} />
    </Routes>
  );
}

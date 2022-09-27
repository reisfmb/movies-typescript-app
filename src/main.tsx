import React from 'react';
import ReactDOM from 'react-dom/client';
import { MoviesTable } from './components/MoviesTable';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MoviesTable />
  </React.StrictMode>
)

// src/pages/Dashboard.test.js
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

test('renders welcome text when not logged in', () => {
  localStorage.clear();
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
  expect(screen.getByText(/welcome! please log in or register/i)).toBeInTheDocument();
});

test('shows admin features for admin user', () => {
  localStorage.setItem('token', 'token');
  localStorage.setItem('userRole', 'admin');
  render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
  expect(screen.getByText(/admin panel/i)).toBeInTheDocument();
  localStorage.clear();
});

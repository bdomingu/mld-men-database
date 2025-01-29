import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Add this line
import '@testing-library/jest-dom';
import Login from '../pages/login'; // Adjust the path

test('renders login form and handles submit', async () => {
  const { getByLabelText, getByText } = render(<Login />);

  const emailInput = getByLabelText('Email address');
  const passwordInput = getByLabelText('Password');
  const submitButton = getByText('Submit');

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

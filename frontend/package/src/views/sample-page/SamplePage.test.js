import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SamplePage from './SamplePage';

vi.mock('react-quill', () => {
  return {
    __esModule: true,
    default: vi.fn(() => <div data-testid="react-quill-mock">Quill Mock</div>),
  };
});

test('renders the main heading', () => {
  render(<SamplePage />);
  expect(screen.getByText(/Text Styler/i)).toBeInTheDocument();
});

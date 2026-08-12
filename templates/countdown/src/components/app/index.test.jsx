import {
  describe, it, afterEach,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { CountDownContextProvider } from '../../contexts/count-down-context';
import App from '.';

afterEach(cleanup);

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <CountDownContextProvider>
        <App />
      </CountDownContextProvider>,
    );
  });
});

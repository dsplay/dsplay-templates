import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { LoaderContext } from '@dsplay/react-template-utils';
import FitText from '.';

afterEach(cleanup);

describe('FitText', () => {
  it('keeps its text hidden until the size is calculated', () => {
    const { container } = render(<FitText>Breaking news</FitText>);
    const box = container.firstChild;
    expect(box.textContent).toBe('Breaking news');
    expect(box.style.visibility).toBe('hidden');
  });

  it('measures again once the Loader has revealed the template', () => {
    const { container, rerender } = render(
      <LoaderContext.Provider value={{ ready: false }}><FitText>Breaking news</FitText></LoaderContext.Provider>,
    );
    const before = container.firstChild;
    rerender(<LoaderContext.Provider value={{ ready: true }}><FitText>Breaking news</FitText></LoaderContext.Provider>);
    expect(container.firstChild).not.toBe(before);
  });
});

import { createElement } from 'react';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
    const { fill: _fill, priority: _priority, ...imgProps } = props;
    return createElement('img', { ...imgProps, alt: props.alt ?? '' });
  },
}));

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 16);
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (id: number) => window.clearTimeout(id);
}
import { createElement } from 'react';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [0];

  disconnect() {}

  observe() {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve() {}
}

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

if (!window.IntersectionObserver) {
  window.IntersectionObserver = MockIntersectionObserver;
}

if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = MockIntersectionObserver;
}

if (!window.HTMLElement.prototype.scrollTo) {
  window.HTMLElement.prototype.scrollTo = function scrollTo(options?: ScrollToOptions | number, y?: number) {
    if (typeof options === 'undefined') {
      return;
    }

    if (typeof options === 'number') {
      this.scrollLeft = options;
      this.scrollTop = y ?? 0;
      return;
    }

    this.scrollLeft = options.left ?? this.scrollLeft;
    this.scrollTop = options.top ?? this.scrollTop;
  };
}
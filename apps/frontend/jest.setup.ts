import '@testing-library/jest-dom';
import fetch from 'node-fetch';

if (!global.fetch) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.fetch = fetch as any;
}

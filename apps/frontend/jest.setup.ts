import '@testing-library/jest-dom';
import fetch from 'node-fetch';

if (!global.fetch) {
  global.fetch = fetch as typeof fetch;
}
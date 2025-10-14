import type { Config } from 'jest';

const config: Config = {
  projects: [
    '<rootDir>/apps/api/jest.config.ts',
    '<rootDir>/apps/frontend/jest.config.ts',
  ],
};

export default config;

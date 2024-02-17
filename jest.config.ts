import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  rootDir: './src',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;

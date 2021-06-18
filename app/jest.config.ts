import { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // transform: {
  //   '^.+\\.ts$': 'ts-jest',
  //   '.*\\.(vue)$': 'vue-jest',
  // },
  moduleNameMapper: {
    '~/(.*)': '<rootDir>/$1',
    '@/(.*)': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.vue',
    '<rootDir>/src/**/*.ts',
    '<rootDir>/command/**/*.ts',
  ],
}

export default config

/* eslint-disable unused-imports/no-unused-vars */
import 'jest-extended';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeAscendingOrder: () => void;
    }
  }
}

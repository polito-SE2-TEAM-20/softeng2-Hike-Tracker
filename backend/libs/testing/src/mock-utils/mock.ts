import { MethodsOf, PartiallyMockedInterface } from '../types';

export function mock<T>(methods: Array<MethodsOf<T>>): jest.Mocked<T> {
  const partiallyMocked: PartiallyMockedInterface<T> = {};

  methods.forEach(
    (mockedMethod) => (partiallyMocked[mockedMethod] = jest.fn()),
  );

  return partiallyMocked as jest.Mocked<T>;
}

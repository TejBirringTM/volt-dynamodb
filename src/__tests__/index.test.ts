import { describe, test, expect } from 'vitest';
import { doSomething } from '../index';

describe('package', () => {
  test("'doSomething' function", () => {
    expect(doSomething()).toEqual(true);
  });
});

import { square } from "./index";

describe("index.ts", () => {
  describe("double", () => {
    it("should return 1 when 1 is the parameter", () => {
      expect(square(1)).toEqual(1);
    });

    it("should return 4 when 2 is the parameter", () => {
      expect(square(2)).toEqual(4);
    });
  });
});

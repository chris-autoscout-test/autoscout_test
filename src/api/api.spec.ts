import request from "supertest";
import api from "./api";

describe("api.ts", () => {
  it.skip("should return 200 on the root", async () => {
    const res = await request(api).get("/report").send();
    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ foo: "bar" });
  });
});

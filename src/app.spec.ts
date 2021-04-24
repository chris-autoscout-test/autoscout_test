import request from "supertest";
import app from "./app";

describe("app.ts", () => {
  it("should return 200 on the root", async () => {
    const res = await request(app).get("/").send();
    expect(res.status).toEqual(200);
  });
});

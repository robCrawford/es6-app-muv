import { testComponent, NextData } from "jetix";
import aboutPage from "./aboutPage";

describe("About Page component", () => {
  const { config } = testComponent(aboutPage);

  it("should run initial action", () => {
    expect(config.init).toEqual({ name: "SetDocTitle", data: { title: "About" } });
  });

});

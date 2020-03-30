import { testComponent, NextData } from "jetix";
import app, { RootState } from "./app";

describe("App", () => {

  const { action, task, initialState } = testComponent(app);

  it("should set initial state", () => {
    expect(initialState).toEqual({
      theme: "light",
      page: null,
      likes: {
        counterPage: 0,
        aboutPage: 0
      }
    });
  });

  describe("'SetPage' action", () => {
    const { state, next } = action<RootState>("SetPage", { page: "test" });

    it("should update state", () => {
      expect(state).toEqual({
        ...initialState,
        page: "test"
      });
    });

    it("should not return next", () => {
      expect(next).toBeUndefined();
    });
  });

  describe("'SetTheme' action", () => {
    const { state, next } = action<RootState>("SetTheme", { theme: "test" });

    it("should update state", () => {
      expect(state).toEqual({
        ...initialState,
        theme: "test"
      });
    });

    it("should not return next", () => {
      expect(next).toBeUndefined();
    });
  });

  describe("'Like' action", () => {
    const { state, next } = action<RootState>("Like", { page: "aboutPage" });

    it("should update state", () => {
      expect(state).toEqual({
        ...initialState,
        likes: {
          ...initialState.likes,
          aboutPage: 1
        }
      });
    });

    it("should not return next", () => {
      expect(next).toBeUndefined();
    });
  });

  describe("'SetDocTitle' task", () => {
    const { perform, success, failure } = task("SetDocTitle", { count: 0 });

    it("should provide perform", () => {
      expect(perform).toBeDefined();
    });

    it("should not provide success", () => {
      expect(success).toBeUndefined();
    });

    it("should not provide failure", () => {
      expect(failure).toBeUndefined();
    });
  });

});

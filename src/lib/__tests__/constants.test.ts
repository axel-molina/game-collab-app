import { describe, it, expect } from "vitest";
import { getEngineLabel, getPositionLabel, getEngineColor } from "../constants";

describe("Constants Helpers", () => {
  describe("getEngineLabel", () => {
    it("should return correct label for known engine", () => {
      expect(getEngineLabel("unity")).toBe("Unity");
      expect(getEngineLabel("godot")).toBe("Godot");
    });

    it("should return the value itself if engine is unknown", () => {
      expect(getEngineLabel("unknown-engine")).toBe("unknown-engine");
    });
  });

  describe("getPositionLabel", () => {
    it("should return correct label for known position", () => {
      expect(getPositionLabel("programmer")).toBe("Programador");
    });

    it("should return the value itself if position is unknown", () => {
      expect(getPositionLabel("intern")).toBe("intern");
    });
  });

  describe("getEngineColor", () => {
    it("should return correct utility class for known engine", () => {
      expect(getEngineColor("unity")).toBe("bg-engine-unity");
      expect(getEngineColor("godot")).toBe("bg-engine-godot");
    });

    it("should return 'bg-engine-other' for unknown engine", () => {
      expect(getEngineColor("unknown")).toBe("bg-engine-other");
    });
  });
});

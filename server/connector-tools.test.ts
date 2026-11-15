import { describe, expect, it } from "vitest";
import { parseConnectorTools } from "./connector-tools.ts";

describe("parseConnectorTools slugs", () => {
  it("accepts a toolkit slug that starts with one underscore", () => {
    expect(parseConnectorTools({ _1password: { tools: "*" } })).toEqual({ ok: true, grants: { _1password: { tools: "*" } } });
  });

  it("refuses __proto__, a doubled underscore, an empty slug and a leading dash", () => {
    for (const slug of ["__proto__", "__twice", "", "-bad"]) {
      expect(parseConnectorTools(JSON.parse(`{${JSON.stringify(slug)}:{"tools":"*"}}`)).ok).toBe(false);
    }
  });
});

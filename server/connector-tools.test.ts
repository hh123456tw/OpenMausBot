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

describe("parseConnectorTools tool names", () => {
  it("accepts an underscore-leading tool name", () => {
    expect(parseConnectorTools({ _1password: { tools: ["_1PASSWORD_GET_ITEM"] } }))
      .toEqual({ ok: true, grants: { _1password: { tools: ["_1PASSWORD_GET_ITEM"] } } });
  });

  it("refuses a doubled underscore, an empty name, a digit start and lowercase", () => {
    for (const tool of ["__PROTO__", "__TWICE_X", "", "1PASSWORD_X", "_1password_get_item", "gmail_send_email"]) {
      expect(parseConnectorTools({ _1password: { tools: [tool] } }).ok, tool).toBe(false);
    }
  });
});

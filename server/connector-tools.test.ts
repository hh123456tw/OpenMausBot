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

  it("caps a tool name at 128 characters in both the letter and underscore-leading forms", () => {
    const accepted = (tool: string) => parseConnectorTools({ gmail: { tools: [tool] } }).ok;
    expect(accepted("A".repeat(128))).toBe(true);
    expect(accepted("A".repeat(129))).toBe(false);
    expect(accepted("_" + "A".repeat(127))).toBe(true);
    expect(accepted("_" + "A".repeat(128))).toBe(false);
  });
});

describe("parseConnectorTools slug length", () => {
  it("caps an underscore-leading slug at 82 characters", () => {
    const accepted = (slug: string) => parseConnectorTools({ [slug]: { tools: "*" } }).ok;
    expect(accepted("_" + "a".repeat(81))).toBe(true);
    expect(accepted("_" + "a".repeat(82))).toBe(false);
  });
});

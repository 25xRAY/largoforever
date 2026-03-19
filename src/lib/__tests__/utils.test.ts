import {
  cn,
  formatCurrency,
  formatDate,
  formatPercentage,
  generateSlug,
  getAlertPriority,
  getInitials,
  getReadinessColor,
  truncateText,
} from "@/lib/utils";

describe("cn", () => {
  it("merges classes", () => {
    expect(cn("a", "b")).toContain("a");
    expect(cn("a", "b")).toContain("b");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("formatCurrency", () => {
  it("formats zero and large values", () => {
    expect(formatCurrency(0)).toMatch(/\$0/);
    expect(formatCurrency(1000)).toMatch(/1,000/);
    expect(formatCurrency(999999)).toMatch(/999,999/);
  });

  it("handles null, undefined, NaN, negative", () => {
    expect(formatCurrency(null)).toBe("$0.00");
    expect(formatCurrency(undefined)).toBe("$0.00");
    expect(formatCurrency(Number.NaN)).toBe("$0.00");
    expect(formatCurrency(-1)).toMatch(/-/);
  });
});

describe("formatDate", () => {
  it("formats valid ISO string", () => {
    const s = formatDate("2026-06-02T12:00:00.000Z");
    expect(s.length).toBeGreaterThan(4);
  });

  it("returns empty for null and invalid", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("")).toBe("");
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("formatPercentage", () => {
  it("handles null and value", () => {
    expect(formatPercentage(null)).toBe("0%");
    expect(formatPercentage(42.5, 1)).toBe("42.5%");
  });
});

describe("truncateText", () => {
  it("truncates long text", () => {
    expect(truncateText("hello world", 8)).toBe("hello...");
  });

  it("handles null", () => {
    expect(truncateText(null, 5)).toBe("");
  });
});

describe("generateSlug", () => {
  it("slugifies", () => {
    expect(generateSlug("  Hello World!  ")).toBe("hello-world");
  });
});

describe("getInitials", () => {
  it("handles empty and names", () => {
    expect(getInitials("")).toBe("?");
    expect(getInitials("Jane Doe")).toBe("JD");
  });
});

describe("getReadinessColor", () => {
  it("maps thresholds per implementation", () => {
    expect(getReadinessColor(null)).toBe("danger");
    expect(getReadinessColor(Number.NaN)).toBe("danger");
    expect(getReadinessColor(0)).toBe("danger");
    expect(getReadinessColor(39)).toBe("danger");
    expect(getReadinessColor(40)).toBe("warning");
    expect(getReadinessColor(69)).toBe("warning");
    expect(getReadinessColor(70)).toBe("success");
    expect(getReadinessColor(100)).toBe("success");
  });
});

describe("getAlertPriority", () => {
  it("orders priorities", () => {
    expect(getAlertPriority("GREEN")).toBeLessThan(getAlertPriority("YELLOW"));
    expect(getAlertPriority("YELLOW")).toBeLessThan(getAlertPriority("RED"));
  });
});

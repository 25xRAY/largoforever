import {
  renderIndexPageToHTML,
  renderResourcesPageToHTML,
  renderWallOfWinsToHTML,
  renderYearbookPageToHTML,
} from "@/lib/static-generator";

describe("static-generator", () => {
  it("renders self-contained HTML", () => {
    expect(renderIndexPageToHTML()).toContain("<!DOCTYPE html>");
    expect(renderWallOfWinsToHTML(["UMD", "Bowie State"])).toContain("UMD");
    expect(renderYearbookPageToHTML("Alex", "Go Lions")).toContain("Alex");
    expect(renderResourcesPageToHTML()).toContain("Resources");
  });
});

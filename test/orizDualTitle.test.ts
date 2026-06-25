// oriz-fork: tests for the dual-title + preference-badge gating logic.

import { decideOrizDualTitleRender } from "../src/titles/orizDualTitle";

describe("oriz-fork: decideOrizDualTitleRender", () => {
    it("renders when both settings ON and titles differ", () => {
        const d = decideOrizDualTitleRender("DeArrow Title", "Original Clickbait", true, true);
        expect(d.render).toBe(true);
        expect(d.showOriginal).toBe(true);
        expect(d.showBadge).toBe(true);
    });

    it("skips render when both settings OFF", () => {
        const d = decideOrizDualTitleRender("DeArrow Title", "Original Clickbait", false, false);
        expect(d.render).toBe(false);
    });

    it("skips render when titles are identical (nothing to compare)", () => {
        const d = decideOrizDualTitleRender("Same Title", "Same Title", true, true);
        expect(d.render).toBe(false);
    });

    it("skips render when originalTitle is empty", () => {
        const d = decideOrizDualTitleRender("DeArrow Title", "", true, true);
        expect(d.render).toBe(false);
    });

    it("renders with only showOriginal ON", () => {
        const d = decideOrizDualTitleRender("DeArrow Title", "Original Clickbait", true, false);
        expect(d.render).toBe(true);
        expect(d.showOriginal).toBe(true);
        expect(d.showBadge).toBe(false);
    });

    it("renders with only showPreferenceBadge ON", () => {
        const d = decideOrizDualTitleRender("DeArrow Title", "Original Clickbait", false, true);
        expect(d.render).toBe(true);
        expect(d.showOriginal).toBe(false);
        expect(d.showBadge).toBe(true);
    });
});

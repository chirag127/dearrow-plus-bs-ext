// oriz-fork: pure helpers for the dual-title display + preference badge feature.
// Kept here (separate from titleRenderer.ts which pulls browser/Chrome globals)
// so jest can unit-test the decision logic in plain node without jsdom mocking.

export interface OrizDualTitleDecision {
    render: boolean;
    showOriginal: boolean;
    showBadge: boolean;
}

export function decideOrizDualTitleRender(
    dearrowTitle: string,
    originalTitle: string,
    showOriginal: boolean,
    showBadge: boolean
): OrizDualTitleDecision {
    if (!showOriginal && !showBadge) {
        return { render: false, showOriginal: false, showBadge: false };
    }
    if (!originalTitle || !dearrowTitle) {
        return { render: false, showOriginal, showBadge };
    }
    if (originalTitle === dearrowTitle) {
        return { render: false, showOriginal, showBadge };
    }
    return { render: true, showOriginal, showBadge };
}

import { getSubschool } from "../subschools/subschools.mjs";

export function registerSpellHeader() {
    Hooks.on("renderApplicationV2", (app, html) => {
        const item = app.document;
        if (!item || item.type !== "spell") return;

        // Tidy5e sheet 
        const tidySubtitle = html.querySelector(
            ".sheet-header .subtitle"
        );

        if (tidySubtitle) {
            // Save the original
            if (!tidySubtitle.dataset.submagicOriginal) {
                tidySubtitle.dataset.submagicOriginal =
                    tidySubtitle.textContent.trim();
            }

            // Always start with the original
            const originalText = tidySubtitle.dataset.submagicOriginal;

            const subschoolId = item.getFlag("submagic", "subschool");
            const subschool = subschoolId
                ? getSubschool(subschoolId)
                : null;

            // Then rebuild the subtitle
            tidySubtitle.textContent = subschool
                ? `${originalText} (${subschool.label})`
                : originalText;

            return;
        }

        // Default dnd5e sheet 
        const subtitleSpans = html.querySelectorAll(
            "ul.subtitles.unlist span"
        );

        const schoolSpan = subtitleSpans[1];
        if (!schoolSpan) return;

        if (!schoolSpan.dataset.submagicOriginal) {
            schoolSpan.dataset.submagicOriginal =
                schoolSpan.textContent.trim();
        }

        const subschoolId = item.getFlag("submagic", "subschool");
        const subschool = subschoolId
            ? getSubschool(subschoolId)
            : null;

        schoolSpan.textContent = subschool
            ? `${schoolSpan.dataset.submagicOriginal} (${subschool.label})`
            : schoolSpan.dataset.submagicOriginal;
    });
}

import { getSubschool } from "../subschools/subschools.mjs";

export function updateSpellSchoolTooltips(app, html) {
    if (!app.actor) return;

    const schoolElements = html.querySelectorAll(
        ".item-detail.item-school, .spell-school-icon"
    );

    for (const element of schoolElements) {
        // Find the associated item row or Tidy5e container.
        const itemRow = element.closest(
            "[data-item-id], .tidy-table-row-container"
        );

        if (!itemRow) continue;

        // Retrieve the spell document.
        const spell = app.actor.items.get(itemRow.dataset.itemId);

        if (!spell || spell.type !== "spell") continue;

        // Get the subschool.
        const subschoolId = spell.getFlag("submagic", "subschool");
        if (!subschoolId) continue;

        const subschool = getSubschool(subschoolId);
        if (!subschool) continue;

        // Get the existing school label.
        const school = element.getAttribute("aria-label")
            || element.dataset.tooltip;

        if (!school) continue;

        // Update tooltip.
        const tooltip = `${school} (${subschool.label})`;

        element.dataset.tooltip = tooltip;
        element.setAttribute("aria-label", tooltip);
    }
}
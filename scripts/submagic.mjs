import { registerSubschoolSettings } from "./subschools/settings.mjs";
import { registerSubschoolSettingsMenu } from "./subschools/subschool-settings.mjs";
import { registerSpellSheet } from "./sheets/spell-sheet.mjs";
import { registerSpellHeader } from "./sheets/spell-header.mjs";
import { compendiumBrowserFilters } from "./compendium-browser-filter.mjs";
import { chooseAdvancement, registerSubschoolBrowserFilter } from "./advancement/choose-items-advancement.mjs";
import { updateSpellSchoolTooltips } from "./sheets/tooltip.mjs";

Hooks.once("init", () => {
    registerSubschoolSettings();
    registerSubschoolSettingsMenu();

    registerSpellSheet();
    registerSpellHeader();

    compendiumBrowserFilters();
    //chooseAdvancement();

    console.log("Subschool of Magic | Initialized");
});

Hooks.once("ready", () => {
      // registerSubschoolBrowserFilter();
    console.log("Subschool of Magic | Ready.");
});

Hooks.on("renderApplicationV2", (app, html) => {
    updateSpellSchoolTooltips(app, html);
});
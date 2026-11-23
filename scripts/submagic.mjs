import { registerSubschoolSettings } from "./subschools/settings.mjs";
import { registerSubschoolSettingsMenu } from "./subschools/subschool-settings.mjs";
import { registerSpellSheet } from "./sheets/spell-sheet.mjs";
import { registerSpellHeader } from "./sheets/spell-header.mjs";
import { compendiumBrowserFilters } from "./compendium-browser-filter.mjs";
import { chooseAdvancement, SubSchoolItemChoiceFlow } from "./advancement/choose-items-advancement.mjs";

Hooks.once("init", () => {
    registerSubschoolSettings();
    registerSubschoolSettingsMenu();

    registerSpellSheet();
    registerSpellHeader();

    compendiumBrowserFilters();
    chooseAdvancement();

    console.log("Subschool of Magic | Initialized");
});

Hooks.once("ready", () => {
      SubSchoolItemChoiceFlow();
    console.log("Subschool of Magic | Ready.");
});
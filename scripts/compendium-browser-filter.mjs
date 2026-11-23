import { getSubschoolOptions } from "./subschools/subschools.mjs";

//Many thanks to Tyler @Sayshal for help on this
export function compendiumBrowserFilters() {

    let subChoices = getSubschoolOptions();

  const SpellData = CONFIG.Item.dataModels.spell;
  const original = Object.getOwnPropertyDescriptor(SpellData, "compendiumBrowserFilters").get;
  Object.defineProperty(SpellData, "compendiumBrowserFilters", {
    configurable: true,
    get() {
      const filters = original.call(this);
      filters.set("subschool", {
        label: "Sub-School",
        type: "set",
        config: {
          keyPath: "flags.submagic.subschool",
          choices: subChoices 
        }
      });
      return filters;
    }
  });

}
import { getSubschoolList, getSubschool } from "../subschools/subschools.mjs";

Hooks.on("renderItemChoiceConfig", async (app, html, context) => {

  const rootElement = html.jquery ? html : html;

  const schoolInput = rootElement.querySelector('[name="configuration.restriction.school"]');
  if (!schoolInput) return;

  const schoolFormGroup = schoolInput.closest('.form-group');

  if (schoolFormGroup){
  
    const templatePath = "modules/submagic/templates/advancement-subschool.hbs";
    const myCustomHtml = await foundry.applications.handlebars.renderTemplate(templatePath, context);
  
    schoolFormGroup.insertAdjacentHTML('afterend', myCustomHtml);
  }
}); 

export function chooseAdvancement() {
    const ItemChoiceConfigurationData =
        dnd5e.dataModels.advancement.ItemChoiceConfigurationData;

    if (!ItemChoiceConfigurationData) {
        console.error(
            "Subschool of Magic | Could not find ItemChoiceConfigurationData."
        );
        return;
    }

    const originalDefineSchema =
        ItemChoiceConfigurationData.defineSchema;

    ItemChoiceConfigurationData.defineSchema = function() {
        const schema = originalDefineSchema.call(this);

        schema.restriction.fields.subschool = new foundry.data.fields.SetField(
            new foundry.data.fields.StringField(),
            {
                label: "SUBMAGIC.ADVANCEMENT.FIELDS.subschool.label",
                hint: "SUBMAGIC.ADVANCEMENT.FIELDS.subschool.hint"
            }
        );

        return schema;
    };

    console.log(
        "Subschool of Magic | Added subschool advancement restriction."
    );

    const ItemChoiceConfigClass = dnd5e.applications.advancement.ItemChoiceConfig;

    const originalPrepareContext = ItemChoiceConfigClass.prototype._prepareContext;

    ItemChoiceConfigClass.prototype._prepareContext = async function(options) {
        const context = await originalPrepareContext.call(this, options);

        context.subschoolRestrictionOptions = getSubschoolList().map(
            ({ id, label }) => ({
                value: id,
                label
            })
        );

        return context;
    };
}

export function registerSubschoolBrowserFilter() {
      const originalSelect = CompendiumBrowser.select;

    CompendiumBrowser.select = async function(options = {}, ...args) {

        const additional = options.filters?.locked?.additional;


            // Retrieve the active advancement restriction.
            const restriction = game.submagic?.activeRestriction;

            if (restriction?.subschool?.size) {
                additional.subschool = Object.fromEntries(
                    Array.from(restriction.subSchool).map(subschool => [
                        subschool,
                        1
                    ])
                );
            }

        return originalSelect.call(this, options, ...args);
    };
}
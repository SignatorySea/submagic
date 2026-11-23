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

        schema.restriction.fields.subSchool = new foundry.data.fields.SetField(
            new foundry.data.fields.StringField(),
            {
                label: "SUBMAGIC.ADVANCEMENT.FIELDS.subSchool.label",
                hint: "SUBMAGIC.ADVANCEMENT.FIELDS.subSchool.hint"
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

        context.subSchoolRestrictionOptions = getSubschoolList().map(
            ({ id, label }) => ({
                value: id,
                label
            })
        );

        return context;
    };
}


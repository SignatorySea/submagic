
import { getSubschoolOptions } from "../subschools/subschools.mjs";

/**
 * Add the subschool dropdown to spell item sheets.
 * Replicating appearance of the School dropdown
 */
export function registerSpellSheet() {

    Hooks.on("renderApplicationV2", (app, html) => {

        const item = app.document;

        // Only apply to spell sheets.
        if (!item || item.type !== "spell") return;

        // Find the existing school dropdown.
        // Supports default dnd5e and Tidy5e.
        const schoolField =
            html.querySelector('select[name="system.school"]') ?? //default 5e selector
            html.querySelector('select[data-name="system.school"]'); //I believe this is the right selector for Tidysheets

        if (!schoolField) return;

        //stop duplicates
        if (html.querySelector(".submagic-subschool")) return;


        const schoolGroup = schoolField.closest(".form-group");

        if (!schoolGroup) return;

        // Create the new form group.
        const group = document.createElement("div");
        group.classList.add("form-group", "submagic-subschool");

        const label = document.createElement("label");
        label.textContent = "Subschool";

        const fields = document.createElement("div");
        fields.classList.add("form-fields");

        const select = document.createElement("select");
        select.name = "flags.submagic.subschool";

        // Blank option for the dropdown
        const blank = document.createElement("option");
        blank.value = "";
        blank.textContent = " ";
        select.appendChild(blank);

        // Populate configured subschools from the settings
        for (const option of getSubschoolOptions()) {
            const element = document.createElement("option");

            element.value = option.value;
            element.textContent = option.label;

            select.appendChild(element);
        }

        // Restore previously selected subschool.
        select.value = item.getFlag("submagic", "subschool") ?? "";

        // Save the bitch
        select.addEventListener("change", async () => {
            const value = select.value;
                
            try {
                if (value) {
                    await item.setFlag("submagic", "subschool", value);
                } else {
                    await item.unsetFlag("submagic", "subschool");
                }
            
                // Keep the dropdown synchronized with the saved flag.
                select.value = item.getFlag("submagic", "subschool") ?? "";
            
            } catch (error) {
                console.error(
                    "Subschool of Magic | Failed to save subschool",
                    error
                );
            }
        });

        // Assemble it alltogether
        fields.appendChild(select);
        group.append(label, fields);

        schoolGroup.after(group);
    });

}

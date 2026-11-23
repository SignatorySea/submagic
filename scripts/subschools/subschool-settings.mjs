
import {
    getSubschoolList
} from "./subschools.mjs";

import {
    addSubschool,
    updateSubschool,
    removeSubschool,
} from "./settings.mjs";

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } =
    foundry.applications.api;

export class SubschoolSettingsApplication extends
    HandlebarsApplicationMixin(ApplicationV2) {

    static DEFAULT_OPTIONS = {
        id: "submagic-settings",
        classes: ["submagic", "subschool-settings"],

        window: {
            title: "Subschool of Magic",
            resizable: true
        },

        position: {
            width: 500,
            height: "auto"
        },

        actions: {
            addSubschool: this.#onAddSubschool,
            editSubschool: this.#onEditSubschool,
            deleteSubschool: this.#onDeleteSubschool
        }
    };

    static PARTS = {
        main: {
            template: "modules/submagic/templates/subschool-settings.hbs"
        }
    };

    /**
     * Prepare the application context.
     */
    async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const subschools = getSubschoolList();

    context.subschools = subschools;

    return context;
}

    /**
     * Add a new subschool.
     */
    static async #onAddSubschool(event, target) {
        const data = await DialogV2.input({
            window: {
                title: "Add Subschool"
            },

            content: `
                <div class="form-group">
                    <label>Subschool ID</label>
                    <input
                        type="text"
                        name="id"
                        placeholder="blood"
                        required
                    >
                    <p class="hint">
                        A permanent identifier. Use lowercase letters,
                        numbers, hyphens, or underscores.
                    </p>
                </div>

                <div class="form-group">
                    <label>Display Name</label>
                    <input
                        type="text"
                        name="label"
                        placeholder="Blood"
                        required
                    >
                </div>
            `,

            ok: {
                label: "Create Subschool"
            }
        });

        if (!data) return;

        const id = data.id.trim().toLowerCase();
        const label = data.label.trim();

        if (!/^[a-z0-9][a-z0-9_-]*$/.test(id)) {
            return ui.notifications.error(
                "Invalid subschool ID."
            );
        }

        if (!label) {
            return ui.notifications.error(
                "A display name is required."
            );
        }

        try {
            await addSubschool(id, {
                label
            });

            this.render();
        } catch (error) {
            console.error("Subschool of Magic | Add failed", error);
            ui.notifications.error(error.message);
        }
    }

    /**
     * Edit an existing subschool.
     */
    static async #onEditSubschool(event, target) {
        const id = target.dataset.id;

        const school = getSubschoolList()
            .find(s => s.id === id);

        if (!school) return;

        const data = await DialogV2.input({
            window: {
                title: `Edit ${school.label}`
            },

            content: `
                <div class="form-group">
                    <label>Subschool ID</label>
                    <input
                        type="text"
                        value="${foundry.utils.escapeHTML(id)}"
                        disabled
                    >
                    <p class="hint">
                        IDs cannot be changed after creation.
                    </p>
                </div>

                <div class="form-group">
                    <label>Display Name</label>
                    <input
                        type="text"
                        name="label"
                        value="${foundry.utils.escapeHTML(school.label)}"
                        required
                    >
                </div>
            `,

            ok: {
                label: "Save Changes"
            }
        });

        if (!data) return;

        const label = data.label.trim();

        if (!label) {
            return ui.notifications.error(
                "A display name is required."
            );
        }

        try {
            await updateSubschool(id, {
                label
            });

            this.render();
        } catch (error) {
            console.error("Subschool of Magic | Edit failed", error);
            ui.notifications.error(error.message);
        }
    }

    /**
     * Delete an existing subschool.
     */
    static async #onDeleteSubschool(event, target) {
        const id = target.dataset.id;

        const school = getSubschoolList()
            .find(s => s.id === id);

        if (!school) return;

        const confirmed = await DialogV2.confirm({
            window: {
                title: "Delete Subschool"
            },

            content: `
                <p>
                    Are you sure you want to delete
                    <strong>${foundry.utils.escapeHTML(school.label)}</strong>?
                </p>
                <p>
                    This cannot be undone.
                </p>
            `
        });

        if (!confirmed) return;

        try {
            await removeSubschool(id);

            this.render();
        } catch (error) {
            console.error("Subschool of Magic | Delete failed", error);
            ui.notifications.error(error.message);
        }
    }
}

/**
 * Open the subschool settings application.
 */
export function openSubschoolSettings() {
    return new SubschoolSettingsApplication().render({
        force: true
    });
}

/**
 * Register the subschool configuration menu.
 */
export function registerSubschoolSettingsMenu() {
    game.settings.registerMenu("submagic", "subschoolSettings", {
        name: "Subschool Configuration",
        label: "Configure Subschools",
        hint: "Add, edit, and remove spell subschools.",
        icon: "fa-solid fa-book-open",
        type: SubschoolSettingsApplication,
        restricted: true
    });
}
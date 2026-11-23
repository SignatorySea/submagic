
import { DEFAULT_SUBSCHOOLS } from "./defaults.mjs";

export const SETTING_KEY = "subschools";

/**
 * Register the subschool world setting.
 */
export function registerSubschoolSettings() {
    game.settings.register("submagic", SETTING_KEY, {
        name: "Subschools",
        scope: "world",
        config: false,
        type: Object,
        default: foundry.utils.deepClone(DEFAULT_SUBSCHOOLS)
    });
}

/**
 * Retrieve all configured subschools.
 */
export function getSubschools() {
    return game.settings.get("submagic", SETTING_KEY);
}

/**
 * Save the complete subschool configuration.
 */
export async function setSubschools(subschools) {
    return game.settings.set("submagic", SETTING_KEY, subschools);
}

/**
 * Add a subschool.
 */
export async function addSubschool(id, configuration) {
    const subschools = foundry.utils.deepClone(getSubschools());

    if (subschools[id]) {
        throw new Error(`Subschool "${id}" already exists.`);
    }

    subschools[id] = configuration;

    return setSubschools(subschools);
}

/**
 * Update an existing subschool.
 */
export async function updateSubschool(id, configuration) {
    const subschools = foundry.utils.deepClone(getSubschools());

    if (!subschools[id]) {
        throw new Error(`Subschool "${id}" does not exist.`);
    }

    subschools[id] = {
        ...subschools[id],
        ...configuration
    };

    return setSubschools(subschools);
}

/**
 * Remove a subschool.
 */
export async function removeSubschool(id) {
    const subschools = foundry.utils.deepClone(getSubschools());

    if (!subschools[id]) return;

    delete subschools[id];

    return setSubschools(subschools);
}

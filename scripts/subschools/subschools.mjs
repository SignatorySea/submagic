import { getSubschools } from "./settings.mjs";

/**
 * Retrieve an individual subschool.
 */
export function getSubschool(id) {
    return getSubschools()[id] ?? null;
}

/**
 * Generate dropdown options.
 */
export function getSubschoolOptions() {
    return Object.entries(getSubschools()).map(([id, data]) => ({
        value: id,
        label: data.label
    }));
}

/**
 * Generate a list of subschool IDs.
 */
export function getSubschoolIds() {
    return Object.keys(getSubschools());
}

/**
 * Generate an array of subschool configurations.
 */
export function getSubschoolList() {
    return Object.entries(getSubschools()).map(([id, data]) => ({
        id,
        ...data
    }));
}
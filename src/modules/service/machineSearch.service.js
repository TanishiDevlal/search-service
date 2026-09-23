import Fuse from 'fuse.js';
import { machineKeyword } from '../../core/Constants.js';

/**
 * Fuzzy search engine for machine keywords.
 * Uses Fuse.js to match user input (including typos, Hinglish, Hindi synonyms)
 * against the machineKeyword dictionary from Constants.js.
 *
 * This is a singleton — initialized once at startup, reused across all requests.
 */
class MachineSearchEngine {
    constructor() {
        this.machineKeyword = machineKeyword;
        this.keywordList = this.#flattenKeywords();
        this.fuse = this.#initializeFuse();
    }

    /**
     * Flatten the { "Excavator": ["poclain", "poklen", ...], ... } dictionary
     * into a flat array [{ keyword, category, searchKey }, ...] for Fuse.js indexing.
     */
    #flattenKeywords() {
        const list = [];
        for (const category in this.machineKeyword) {
            this.machineKeyword[category].forEach(keyword => {
                list.push({
                    keyword,
                    category,
                    searchKey: this.#normalize(keyword)
                });
            });
        }
        return list;
    }

    /**
     * Initialize Fuse.js with the flattened keyword list.
     * threshold: 0.3 means 30% character deviation is tolerated (handles typos).
     * ignoreLocation: true means matches anywhere in the string (not just the start).
     */
    #initializeFuse() {
        return new Fuse(this.keywordList, {
            keys: ['searchKey'],
            threshold: 0.3,
            includeScore: true,
            includeMatches: true,
            ignoreLocation: true,
        });
    }

    /**
     * Normalize text: lowercase, collapse whitespace/underscores to single space, trim.
     */
    #normalize(text) {
        return (text || '').toLowerCase().replaceAll(/[\s_]+/g, ' ').trim();
    }

    /**
     * Given user input, return all matching machine category names.
     * e.g. "poklen" → ["Excavator"], "hydra crane" → ["crane"]
     */
    detectCategories(userInput) {
        const input = this.#normalize(userInput);
        if (!input) return [];

        const results = this.fuse.search(input);
        const matchedCategories = new Set();

        for (const result of results) {
            matchedCategories.add(result.item.category);
        }

        return Array.from(matchedCategories);
    }
}

// Export a singleton instance — Fuse.js index is built once at startup
const machineSearchEngine = new MachineSearchEngine();
export default machineSearchEngine;
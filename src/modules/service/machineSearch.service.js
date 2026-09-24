import Fuse from 'fuse.js';
import { machineKeyword } from '../../core/Constants.js';

class MachineSearchEngine {
    constructor() {
        this.machineKeyword = machineKeyword;
        this.keywordList = this.#flattenKeywords();
        this.fuse = this.#initializeFuse();
    }

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

    #initializeFuse() {
        return new Fuse(this.keywordList, {
            keys: ['searchKey'],
            threshold: 0.3,
            includeScore: true,
            includeMatches: true,
            ignoreLocation: true,
        });
    }

    #normalize(text) {
        return (text || '').toLowerCase().replaceAll(/[\s_]+/g, ' ').trim();
    }

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

const machineSearchEngine = new MachineSearchEngine();
export default machineSearchEngine;
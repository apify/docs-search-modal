import type { HierarchicalItem } from "../types";

/**
 * For two given items, returns the number of hierarchy levels they share in common.
 * 
 * The maximum number of levels is 10 to prevent the UI from getting too cluttered.
 */
export function countFamily(a: HierarchicalItem, b: HierarchicalItem) {
    for(let i = 0; i < 10; i++) {
      if(a.hierarchy[`lvl${i}`] !== b.hierarchy[`lvl${i}`]) return i;
    }
}
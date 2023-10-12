import type { HierarchicalItem } from "../types";

/**
 * For two given items, returns the number of hierarchy levels they share in common.
 * 
 * The maximum number of levels is 10 to prevent the UI from getting too cluttered.
 */
export function countFamily(a: HierarchicalItem, b: HierarchicalItem): number {
    for(let i = 0; i < 10; i++) {
      const ah = a.hierarchy[`lvl${i}`];
      const bh = b.hierarchy[`lvl${i}`];
      if(ah !== bh || !ah || !bh ) return i;
    }
    throw new Error("This should never happen.");
}
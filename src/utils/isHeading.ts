import { HierarchicalItem } from "../types";

export function isHeading(item: HierarchicalItem): boolean {
    for(let i = 2; i < Object.keys(item.hierarchy).length; i++) {
        if(item.hierarchy[`lvl${i}`]) return true
    }
    return false;
}
import { decode } from 'html-entities'; 

/**
 * Extracts the lowest level of the hierarchy from the item to be used as the title.
 */
export const getTitle = (item?: any) => {
    if(!item?._highlightResult?.hierarchy) return '';
  
    const x = Object.entries(item._highlightResult.hierarchy).filter(([_,b]) => b).sort(([a],[b]) => a.localeCompare(b));
  
    return decode((x as any)[x.length - 1][1].value);
}
  
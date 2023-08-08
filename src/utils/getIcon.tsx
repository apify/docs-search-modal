import { BiLogoPython, BiLogoJavascript, BiSolidTerminal } from 'react-icons/bi';
import { IoMdDocument } from 'react-icons/io';

import { HierarchicalItem } from '../types';

/**
 * Returns the proper icon for the item based on the hierarchy.
 * @returns 
 */
export function getIcon({ item }: { item: HierarchicalItem }) {
    if(item?.hierarchy?.lvl0.toLowerCase().includes('python')) {
      return BiLogoPython;
    } else if (item?.hierarchy?.lvl0.toLowerCase().includes('javascript')) {
      return BiLogoJavascript;
    } else if (item?.hierarchy?.lvl0.toLowerCase().includes('cli')) {
      return BiSolidTerminal;
    }
    return IoMdDocument;
  }
  
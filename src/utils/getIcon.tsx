import { BiLogoPython, BiLogoJavascript, BiTerminal } from 'react-icons/bi';
import { CgHashtag } from 'react-icons/cg';
import { DocumentIcon } from './icons';

import { HierarchicalItem } from '../types';
import { isHeading } from './isHeading';

/**
 * Returns the proper icon for the item based on the hierarchy.
 * @returns 
 */
export function getIcon({ item }: { item: HierarchicalItem }) {
    if(isHeading(item)) return CgHashtag;

    if(item?.hierarchy?.lvl0.toLowerCase().includes('python')) {
      return BiLogoPython;
    } else if (item?.hierarchy?.lvl0.toLowerCase().includes('javascript')) {
      return BiLogoJavascript;
    } else if (item?.hierarchy?.lvl0.toLowerCase().includes('cli')) {
      return BiTerminal;
    }
    return DocumentIcon;
  }
  
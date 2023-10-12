import { decode } from "html-entities";
import { isHeading } from "../utils/isHeading";

/**
 * Renders breadcrumbs for the current item.
 */
export function Breadcrumbs({ item, highlight }: any) {
    const breadcrumbs = [
      ...((!isHeading(item)) ? 
        item?.breadcrumbs.map((x: any) => [null,{ value: x, matchLevel: 'full' }] ?? []) :
        item?.breadcrumbs.map((x: any) => [null,{ value: x, matchLevel: 'full' }] ?? []).slice(-1)
      ),
      ...Object.entries(item?._highlightResult?.hierarchy ?? {})
        .filter(([_,b]) => b)
        .sort(([a],[b]) => a.localeCompare(b))
        .slice(1)
    ].slice(1);
  
    return (
      <div className='overflow-x-hidden overflow-ellipsis whitespace-nowrap leading-normal h-auto'>
        { 
          breadcrumbs.map(([_,b]: any, index) => ( (b?.value && b.value.length > 3) ?
          (<span style={{color: 'slategray'}} className="breadcrumbs__item" key={index.toString()}>
            {highlight({hit: { value: b.value ? decode(b.value) : '' }, attribute: 'value'})}
          </span>) : null
        )).filter(x => x)
        }
      </div>
    )
  }
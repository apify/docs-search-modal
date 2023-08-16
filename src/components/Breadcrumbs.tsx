import { decode } from "html-entities";

/**
 * Renders breadcrumbs for the current item.
 */
export function Breadcrumbs({ item, highlight }: any) {
    const x = Object.entries(item?._highlightResult?.hierarchy ?? {}).filter(([_,b]) => b).sort(([a],[b]) => a.localeCompare(b));
  
    return (
      <div className='overflow-x-hidden overflow-ellipsis whitespace-nowrap leading-normal h-auto'>
        { 
          x.map(([_,b]: any, index) => ( (b?.value && b.value.length > 3) ?
          (<span style={{color: 'slategray'}} className="breadcrumbs__item" key={index.toString()}>
            {highlight({hit: { value: b.value ? decode(b.value) : '' }, attribute: 'value'})}
          </span>) : null
        )).filter(x => x)
        }
      </div>
    )
  }
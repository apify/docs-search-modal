import { decode } from "html-entities";

/**
 * Renders breadcrumbs for the current item.
 */
export function Breadcrumbs({ item, highlight }: any) {
    const x = Object.entries(item?._highlightResult?.hierarchy ?? {}).filter(([_,b]) => b).sort(([a],[b]) => a.localeCompare(b));
  
    return (
      <div className='overflow-x-hidden overflow-ellipsis whitespace-nowrap overflow-y-hidden h-auto'>
        { 
          x.map(([_,b]: any, index) => ( (b?.value && b.value.length > 3) ?
          (<span style={{color: 'slategray'}} key={index.toString()}>
            {highlight({hit: { value: b.value ? decode(b.value) : '' }, attribute: 'value'})}
            {index < x.length - 1 && <span className="breadcrumb-separator" style={{color: '#bbb'}}> &gt; </span>}
          </span>) : null
        )).filter(x => x)
        }
      </div>
    )
  }
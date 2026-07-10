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
          breadcrumbs.map(([_,b]: any, index) => {
          if (!b?.value || b.value.length < 2) {
            return null;
          }

          return (<span style={{color: 'slategray'}} className="breadcrumbs__item" key={index.toString()}>
            {
              decode(b.value).startsWith('/v') ?
              (<code className="bg-gray-100 dark:bg-apify-background-subtle rounded-md px-1">
                {highlight({hit: { value: b.value ? decode(b.value) : '' }, attribute: 'value'})}
              </code>) :
              (<span>
                {highlight({hit: { value: b.value ? decode(b.value) : '' }, attribute: 'value'})}
              </span>)
            }
          </span>)
        }).filter(x => x)
        }
      </div>
    )
  }

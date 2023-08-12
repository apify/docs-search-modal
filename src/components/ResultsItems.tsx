import { Breadcrumbs } from "./Breadcrumbs";

import { getTitle } from "../utils/getTitle";
import { getIcon } from "../utils/getIcon";
import { countFamily } from "../utils/countFamily";

function ResultsItem({ item, components, className, onMouseEnter }: { item: any, components: any, className?: string, onMouseEnter?: any }) {
    item = {...item, name: getTitle(item)}

    return (
      <a className={`aa-ItemLink bg-white dark:bg-slate-800 dark:text-white ${className}`} href={item.url} onMouseEnter={onMouseEnter}>
        <div className="aa-ItemContent flex flex-row align-center">
          <div key="icon">
            { getIcon({item})?.({size: 24, color: 'slategray'}) }
          </div>
          <div className="aa-ItemContentBody" style={{paddingLeft: '10px'}} >
            <div className="aa-ItemContentTitle" style={{ fontSize: '90%' }} key="title">
              <components.Highlight hit={item} attribute="name" />
            </div>
            <div className="aa-ItemContentDescription" key="breadcrumbs">
              <Breadcrumbs item={item} highlight={components.Highlight} />
            </div>
          </div>
        </div>
      </a>
    );
  }

export function ResultsItems({ items, setActiveItemId, setContext, components, state }: any) {
  return items?.map((item: any, i: number, a: any[]) => (
      <div key={item.objectID}>
      {((a?.[i-1]?.hierarchy as any)?.lvl0 !== (item?.hierarchy as any)?.lvl0 &&
      <div key='heading' className='text-white bg-slate-400 dark:bg-slate-500 font-medium text-sm px-3 py-1'>
        {(item?.hierarchy as any)?.lvl0}
      </div>
      )}
      <ResultsItem 
          key={item.objectID}
          item={item} 
          components={components}
          className={`p-2 hover:cursor-pointer 
            ${
              a.slice(0, i).some((x: any) => (countFamily(x, item) === 2)) ? 'pl-10' : 'pl-3'
            }
            ${
              state.activeItemId === i ? 'dark:hover:bg-slate-700 hover:bg-slate-100' : ''
            }
          `}  
          onMouseEnter={() => {
            state?.collections?.[0]?.source.onActive({ setContext, item } as any);
            setActiveItemId(i);
          }}
        />
    </div>
  ));
}
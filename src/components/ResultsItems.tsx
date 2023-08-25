import { useEffect, useRef } from "react";

import { Breadcrumbs } from "./Breadcrumbs";

import { getTitle } from "../utils/getTitle";
import { getIcon } from "../utils/getIcon";
import { countFamily } from "../utils/countFamily";
import { useNavigate } from "./ApifySearch";

function ResultsItem({ item, components, className, onMouseEnter, isActive }: { item: any, components: any, className?: string, onMouseEnter?: any, isActive?: boolean }) {
    item = {...item, name: getTitle(item)}
    const ref = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
      if (isActive) {
        ref.current?.scrollIntoView({ block: 'nearest', inline: 'start' });
      }
    }, [isActive]);

    const navigate = useNavigate();

    return (
      <a 
        className={`
          aa-ItemLink dark:text-white 
          ${isActive ? 'dark:bg-slate-700 bg-slate-100' : 'dark:bg-slate-800 bg-white'}  
        ${className}`} 
        href={item.url} 
        onMouseEnter={onMouseEnter} onClick={e => {
          e.preventDefault();
          navigate(item.url);
        }}
        ref={ref}
      >
        <div className="aa-ItemContent flex flex-row align-center">
          <div key="icon">
            { getIcon({item})?.({size: 24, color: 'slategray'}) }
          </div>
          <div className="aa-ItemContentBody" style={{paddingLeft: '10px'}} >
            <div className="aa-ItemContentTitle" style={{ fontSize: '14px', fontWeight: '500', lineHeight: '19.2px' }} key="title">
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
      <div key='heading' className='text-white bg-blue-400 dark:bg-sky-700 font-bold px-3 py-1' style={{fontSize: "13.6px", lineHeight: '18px'}}>
        {(item?.hierarchy as any)?.lvl0}
      </div>
      )}
      <ResultsItem 
          key={item.objectID}
          item={item} 
          components={components}
          isActive={state.activeItemId === i}
          className={`p-2 hover:cursor-pointer 
            ${
              a.slice(0, i).some((x: any) => (countFamily(x, item) === 2)) ? 'pl-10' : 'pl-3'
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
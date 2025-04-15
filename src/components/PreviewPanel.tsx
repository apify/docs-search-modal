import { decode } from "html-entities";

import { Breadcrumbs } from "./Breadcrumbs";

import { useNavigate } from "./ApifySearch";
import { CodeBlock } from "@apify/ui-library";

/**
 * Splits the markdown formatted content into blocks of text and code (delimited by ```).
 * @returns 
 */
function parseIntoBlocks(content: string): { type: 'text' | 'code', value: string, lang?: string }[] {
  content = decode(content);
  if (content.includes('```')) {
    const blocks = content.split('```');
    return blocks.reduce((acc, block, i) => {
      if (i % 2 === 0) {
        return acc.concat(block.split('\r\n').map(x => ({ type: 'text', value: x })));
      }
      return acc.concat([{type: 'code', value: block.replace(/^[^\s]+/, '').trim(), lang: block.match(/^[^\s]+/)?.[0] ?? 'text' } ]);
    }, [] as any);
  }

  return content.split('\r\n').map(x => ({ type: 'text', value: x }))
}

interface TocItem {
  title: string, href: string, children: TocItem[]
}

/**
 * Recursively renders the table of contents
 * @param items Current level of items.
 */
function Toc( { items }: { items: TocItem[] } ) {
  return (
    <ul className='pl-5'>
      { 
        items.map(( item, i ) => (
          <div style={{marginTop: '1em'}} key={i}>
            <a href={item.href} className="text-slate-500 dark:text-slate-300">{i+1}. {item.title}</a>
            { item.children && Toc({ items: item.children }) }
          </div>)
        )
      }
    </ul>
  )
}

export function PreviewPanel({ preview, components }: { preview: any, components: any }) {
  const navigate = useNavigate();

  return (
    <div className="h-full p-5 hidden lg:block bg-slate-50 dark:bg-slate-700 shadow-inner overflow-y-scroll">
      <Breadcrumbs key="breadcrumbs" item={preview} highlight={components.Highlight} />
      <div className="hover:cursor-pointer" onClick={() => navigate(preview.url)}>
        <div key="title" className='w-full text-center text-slate-800 dark:text-slate-100 text-2xl p-7 font-semibold'>
          <components.Highlight hit={preview} attribute={["name"]} />
        </div>
        <div key="preview" className="px-6 pb-6 text-slate-600 dark:text-slate-200 border-none border-b-solid border-b-2 border-b-neutral-200  leading-6">
          {
            parseIntoBlocks(preview.content).map((block: any, i: number) => {
              if(block.type === 'text') {
                return <p className='mb-3' key={i}>{
                  block.value.split('`').map((x: string, i: number) => {
                    if(i % 2 === 0) return <span key={i} className="inline">{x}</span>;
                    return <code key={i} className='bg-slate-200 dark:bg-slate-600 px-1 py-0.5 mx-0.5 rounded inline'>{x}</code>
                  })
                }</p>
              } else {
                return <div 
                  className='mb-3 bg-slate-100 dark:bg-slate-800 rounded-l box-border' 
                  key={i} 
                  onClick={(e) => e.stopPropagation()}
                >
                    <CodeBlock
                      content={block.value}
                      language={block.lang}
                      hideLineNumbers={true}
                    />
                </div>
              }
            })
          }
        </div>
      </div>
      {
        (preview.toc?.length) && (preview.toc.length > 0) ?
        (
        <div className='px-6' key="toc">
            <div className='text-slate-600 dark:text-slate-200 font-normal'>
              On this page:
            </div>
            <Toc items={preview.toc} />
        </div>) : null
      }
    </div>
  )
}

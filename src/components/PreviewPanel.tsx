import { decode } from "html-entities";

import { Breadcrumbs } from "./Breadcrumbs";

// @ts-ignore
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
// @ts-ignore
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
// @ts-ignore
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';
// @ts-ignore
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
// @ts-ignore
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker';
// @ts-ignore
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';

SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('shell', bash);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('docker', docker);

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
            <a href={item.href} className="aa-ItemLink" style={{color: 'slategray'}}>{i+1}. {item.title}</a>
            { item.children && Toc({ items: item.children }) }
          </div>)
        )
      }
    </ul>
  )
}

export function PreviewPanel({ preview, components }: { preview: any, components: any }) {
  return (
    <div className="h-full p-5 hidden lg:block bg-slate-50 shadow-inner overflow-y-scroll">
      <Breadcrumbs key="breadcrumbs" item={preview} highlight={components.Highlight} />
      <div key="title" className='w-full text-center text-slate-800 text-2xl p-7 font-semibold'>
        <components.Highlight hit={preview} attribute={["name"]} />
      </div>
      <div key="preview" className="px-6 pb-6 text-slate-600 mb-10 border-b-2 border-neutral-200 leading-6">
        {
          parseIntoBlocks(preview.content).map((block: any, i: number) => {
            if(block.type === 'text') {
              return <p className='mb-3' key={i}>{
                block.value.split('`').map((x: string, i: number) => {
                  if(i % 2 === 0) return x;
                  return <code key={x} className='bg-slate-200 px-1 py-0.5 mx-0.5 rounded'>{x}</code>
                })
              }</p>
            } else {
              return <div className='mb-3 px-3 bg-slate-100 py-3 rounded-l' key={i}>
                <code className="select-all border-0 p-0">
                  <SyntaxHighlighter language={block.lang} style={ prism } customStyle={{background: 'rgba(0,0,0,0)', 'padding': '0px', 'margin' : '0px'}}>    
                    {block.value}
                  </SyntaxHighlighter>
                </code>
              </div>
            }
          })
        }
      </div>
      {
        preview.toc?.length && preview.toc.length > 0 &&
        (
        <div className='px-6' key="toc">
            <div className='text-slate-600 font-normal'>
              On this page:
            </div>
            <Toc items={preview.toc} />
        </div>)

      }
    </div>
  )
}
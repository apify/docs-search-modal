import { createElement, Fragment, useEffect, useRef, useMemo } from 'react';
import { Footer } from './Footer';
import { PreviewPanel } from './PreviewPanel';
import { getTitle } from '../utils/getTitle';
import { getStableGroups } from '../utils/getStableGroups';

import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { setProperty } from '@algolia/autocomplete-js/dist/esm/utils/setProperties';
import algoliasearch from 'algoliasearch/lite';

import '@algolia/autocomplete-theme-classic';
import { ResultsItems } from './ResultsItems';
import { render } from 'react-dom';

const collapseResults = (() => {
  return {
    hide() {
      document.querySelector('.aa-DetachedContainer--modal')?.classList.remove('exisitng-results');
    },
    show() {
      document.querySelector('.aa-DetachedContainer--modal')?.classList.add('exisitng-results');
    }
  }
})();

function Autocomplete(props: any) {
  const containerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment, render },
      defaultActiveItemId: 0,
      detachedMediaQuery: '',
      placeholder: 'Search Apify Docs...',
      getSources: ({ query }: { query: string }) => [
        {
          sourceId: 'products',
          getItems() {
            return getAlgoliaResults({
              searchClient: props.searchClient,
              queries: [
                {
                  indexName: props.indexName,
                  query,
                  params: {
                    hitsPerPage: 20,
                    attributesToSnippet: ['content:35'],
                    attributesToRetrieve: ['content', 'hierarchy', 'toc', 'url'],
                    filters: 'version:latest'
                  },
                },
              ],
              transformResponse(resp) {
                // make the text in the panel selectable by removing the onmousedown event
                let dom = document.querySelector('.aa-Panel') as any;
                if(dom) {
                  setProperty(dom, 'onmousedown', () => {});
                }

                return [
                  getStableGroups(
                    resp.hits[0], 
                    'hierarchy.lvl0'
                  ).map(
                    (items: any) => getStableGroups(items, 'hierarchy.lvl1').map(items => (
                      items.sort((a: any, b: any) => {
                        return Object.values(a.hierarchy).filter(val => val).length - Object.values(b.hierarchy).filter(val => val).length;
                      })
                    )).flat()
                  ).flat()
                ];
              }
            });
          },
          getItemUrl({ item }: { item: any }) {
            return item.url;
          },
          onActive({ item, setContext }: any ) {
            setContext({ preview: item });
          },
          templates: {
            item() {}
          }
        },
      ],
      render({ state, components, Fragment, setContext, setActiveItemId, render }, root) {
        if (state?.query?.length > 0) {

          collapseResults.show();

          if ( state?.collections?.[0].items.length === 0 ) {
            return render (
              <div className='flex flex-col h-full'>
                <div className="flex flex-col justify-center items-center flex-1">
                    <div className='text-slate-400 font-medium text-lg px-3 py-1'>
                      No results :(
                    </div>
                </div>
                <Footer />
              </div>
            , root);
          }

          let { preview } = state.context as any;
          preview = {...preview, name: getTitle(preview)}

          return render (
            <Fragment>
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 flex-1 overflow-hidden">
                  <div className="h-full overflow-y-scroll">
                    <ResultsItems {...{items: state?.collections?.[0]?.items, setActiveItemId, setContext, state, components }} />
                  </div>
                  <PreviewPanel preview={preview} components={components} />
                </div>
                <Footer />
              </div>
              </Fragment>
          , root);
        } else {
          collapseResults.hide();

          return render (
            <></>
          , root);
        }
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  return <div ref={containerRef} />;
}

export function ApifySearch({
  algoliaKey,
  algoliaAppId,
  algoliaIndexName,
  style,
  className,
  ...props
}: {
  algoliaKey: string;
  algoliaAppId: string;
  algoliaIndexName: string;
  className?: string;
  style?: any;
}) {
  const searchClient = useMemo(() => algoliasearch(
    algoliaAppId,
    algoliaKey
  ), [algoliaAppId, algoliaKey]);

  return (
    <div className={`searchbar-container ${className ?? ''}`} style={style ?? {}}>
      <Autocomplete 
        searchClient={searchClient}
        indexName={algoliaIndexName}
        {...props}
      />
    </div>
  );
}


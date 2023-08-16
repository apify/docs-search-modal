import { createElement, Fragment, useEffect, useRef, useMemo, createContext, useContext } from 'react';
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
import { FiSearch } from 'react-icons/fi';

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

const NavigateContext = createContext((...props: any[]) => { throw new Error('The navigate function has not been initialized yet.') });
export const useNavigate = () => useContext(NavigateContext);

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
      openOnFocus: false,
      navigator: {
        navigate({ itemUrl }) {
          props.navigate?.(itemUrl);
        },
      },
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
                    filters: props.filters ?? 'version:latest'
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
                  )
                  .sort((a, b) => {
                    const pathnameA = (new URL(a[0].url)).pathname;
                    const pathnameB = (new URL(b[0].url)).pathname;
    
                    let { location: { pathname } } = window;
    
                    if(['/', ''].includes(pathname)) {
                      pathname = '/academy';
                    }
    
                    const getLongestCommonPrefix = (a: string, b: string) => {
                      return a.split('/').filter(Boolean).reduce((acc, curr, i) => {
                        if (curr === b.split('/').filter(Boolean)[i]) {
                          return acc + curr + '/';
                        }
                        return acc;
                      }, '');
                    };
    
                    const isTheSameLang = (a: string, b: string) => Number(['js', 'python'].some(lang => (a.includes(lang) && b.includes(lang))));
                    
                    return getLongestCommonPrefix(pathnameB, pathname).length + 20 * isTheSameLang(pathnameB, pathname) - getLongestCommonPrefix(pathnameA, pathname).length - 20 * isTheSameLang(pathnameA, pathname);
                  }).map(
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

          let { preview } = state.context as any;
          preview = {...preview, name: getTitle(preview)}

          return render (
            <Fragment>
              <NavigateContext.Provider value={props.navigate}>
                <div className="flex flex-col h-full bg-white dark:bg-slate-800">
                    {
                    state.collections[0].items.length === 0 ? (
                      <div className="flex flex-col justify-center items-center flex-1">
                          <div className='text-slate-400 font-medium text-lg px-3 py-1'>
                            No results :(
                          </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 flex-1 overflow-hidden">
                        <div className="h-full overflow-y-scroll">
                          <ResultsItems {...{items: state?.collections?.[0]?.items, setActiveItemId, setContext, state, components }} />
                        </div>
                        <PreviewPanel preview={preview} components={components} />
                      </div>
                    )
                  }
                  <Footer />
                </div>
              </NavigateContext.Provider>
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

    window.addEventListener('keydown', (e: any) => {
      if (e.key === 'Escape') {
        (document.querySelector('.aa-Input') as any)?.blur();
        search.setIsOpen(false);
        return false;
      }

      if (e.ctrlKey && e.key === 'k') {
        (document.querySelector('.aa-DetachedSearchButton') as any)?.click();
        e.preventDefault();
        e.stopPropagation();

        return false;
      }
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  return (
    <>
      <button 
        onClick={() => {
          (document.querySelector('.aa-DetachedSearchButton') as any)?.click()
        }
      }
        className="hover:cursor-pointer md:px-2 md:pr-4 md:py-1 border-none md:border-solid border-slate-300 border-1 bg-transparent text-slate-500 dark:bg-slate-800 rounded-md flex items-center space-x-2 dark:hover:bg-slate-700 dark:text-slate-50 dark:border-slate-400"
      >
        <FiSearch size={24}/>
        <span className='mx-3 text-sm hidden md:block'>
          Search
        </span>
      </button>
      <div className='hidden' ref={containerRef} />
    </>
  );
}

export function ApifySearch({
  algoliaKey,
  algoliaAppId,
  algoliaIndexName,
  filters,
  style,
  className,
  ...props
}: {
  algoliaKey: string;
  algoliaAppId: string;
  algoliaIndexName: string;
  filters?: string;
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
        filters={filters}
        {...props}
      />
    </div>
  );
}


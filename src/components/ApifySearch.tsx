import { createElement, Fragment, useEffect, useRef, useMemo, createContext, useContext, useState, useCallback } from 'react';
import { getTitle } from '../utils/getTitle';
import { getStableGroups } from '../utils/getStableGroups';

import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { setProperty } from '@algolia/autocomplete-js/dist/esm/utils/setProperties';
import algoliasearch from 'algoliasearch/lite';

import '@algolia/autocomplete-theme-classic';
import { createRoot, type Root } from 'react-dom/client';
import { useHotkeys } from 'react-hotkeys-hook';
import { SearchIcon, ControlKeyIcon } from '../utils/icons';
import { AskAITab, Modal } from './Modal';

const pathPrefixToSectionTag = {
  "/api/client/js": "apify-client-js",
  "/api/client/python": "apify-client-python",
  "/sdk/js": "apify-sdk-js",
  "/sdk/python": "apify-sdk-python",
  "/cli": "apify-cli",
}

function getCurrentSectionTag(pathname: string) {
  return Object.entries(pathPrefixToSectionTag).find(([pathPrefix]) => pathname.startsWith(pathPrefix))?.[1] ?? 'apify-docs'
}

const MAX_RESULTS = 20;

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

const renderingRoots = {
  domRoot: null as HTMLElement | null,
  reactRoot: null as Root | null,
}

function createOrGetRoot(domRoot: HTMLElement): Root {
  if (renderingRoots.domRoot !== domRoot) {
    renderingRoots.domRoot = domRoot;
    renderingRoots.reactRoot = createRoot(domRoot);
  }

  return renderingRoots.reactRoot!;
}


function Autocomplete(props: any) {
  const containerRef = useRef<any>(null);
  const setOpen = useCallback((open: boolean) => {
    if(open) {
      (document.querySelector('.aa-DetachedSearchButton') as any)?.click();
    } else {
      (document.querySelector('.aa-DetachedCancelButton') as any)?.click();
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment, render: () => {} },
      detachedMediaQuery: '',
      defaultActiveItemId: 0,
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
            const currentSection = getCurrentSectionTag(window.location.pathname);

            return getAlgoliaResults({
              searchClient: props.searchclient,
              queries: [
                {
                  indexName: props.indexname,
                  query,
                  params: {
                    hitsPerPage: MAX_RESULTS,
                    attributesToSnippet: ['content:35'],
                    attributesToRetrieve: ['content', 'hierarchy', 'toc', 'url', 'breadcrumbs'],
                    filters: props.filters ?? 'version:latest',
                    facetFilters: `section:${currentSection}`
                  },
                },
                {
                  indexName: props.indexname,
                  query,
                  params: {
                    hitsPerPage: MAX_RESULTS,
                    attributesToSnippet: ['content:35'],
                    attributesToRetrieve: ['content', 'hierarchy', 'toc', 'url', 'breadcrumbs'],
                    filters: props.filters ?? 'version:latest',
                    facetFilters: `section:-${currentSection}`,
                  },
                },
              ],
              transformResponse(resp) {
                // make the text in the panel selectable by removing the onmousedown event
                let dom = document.querySelector('.aa-Panel') as any;
                if(dom) {
                  setProperty(dom, 'onmousedown', () => {});
                  setProperty(dom, 'onmouseout', () => {});
                }

                return [
                  getStableGroups(
                    resp.hits.flat(),
                    'hierarchy.lvl0'
                  )
                  .sort((a, b) => {
                    const pathnameA = (new URL(a[0].url)).pathname;
                    const pathnameB = (new URL(b[0].url)).pathname;

                    let { location: { pathname } } = window;

                    if(['/', ''].includes(pathname)) {
                      pathname = '/platform';
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
                  // .filter((item: any, i: number, a: any[]) => {

                  //   const hierarchyMatches : any[] = Object.values(item?._highlightResult.hierarchy);

                  //   // show the item only if:
                  //   return item?._highlightResult.content.matchLevel === 'full' // the query is a substring of the "content"
                  //   || hierarchyMatches[hierarchyMatches.length - 1].matchLevel === 'full' // the query is a substring of the last item in the "hierarchy" (i.e the retrieved article/heading "name")
                  //   || a.slice(0, i).some((x: any) => (countFamily(x, item) === 2)); // the item is a child of the previous item
                  // }),
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
      render({ state, components, Fragment, setContext, setActiveItemId }, domRoot) {
        const root = createOrGetRoot(domRoot);

        if (state?.query?.length > 0) {
          collapseResults.show();

          let { preview } = state.context as any;
          preview = {...preview, name: getTitle(preview)}

          return root.render (
            <Fragment>
              <NavigateContext.Provider value={props.navigate}>
                <AskAITab
                  currentQuery={state.query}
                  setOpen={setOpen}
                />
                <div className='search-results-container'>
                  <Modal
                    state={state}
                    setActiveItemId={setActiveItemId}
                    setContext={setContext}
                    components={components}
                    preview={preview}
                  />
                </div>
              </NavigateContext.Provider>
            </Fragment>
          );
        } else {
          collapseResults.hide();

          return root.render (
            <Fragment></Fragment>
          );
        }
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  useHotkeys('mod+k, /', () => setOpen(true), {
    preventDefault: true,
  });

  const windowHandler = (e: any) => {
    if(e.key === 'Escape') {
      setOpen(false);
    }
  };

  window.removeEventListener('keydown', windowHandler);
  window.addEventListener('keydown', windowHandler);

  const [key, setKey] = useState<
    '⌘' | 'ctrl' | null
  >(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

      isMac ? setKey('⌘') : setKey('ctrl');
    }
  }, []);


  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="DocSearch DocSearch-Button"
        aria-label="Search"
        {...props}
        >
          <span className="DocSearch-Button-Container">
            <SearchIcon />
            <span className="DocSearch-Button-Placeholder">Search</span>
          </span>
          <span className="DocSearch-Button-Keys">
          {key !== null && (
              <>
                <kbd className="DocSearch-Button-Key">
                  {key === 'ctrl' ? <ControlKeyIcon /> : key}
                </kbd>
                <kbd className="DocSearch-Button-Key">K</kbd>
              </>
            )}
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
        searchclient={searchClient}
        indexname={algoliaIndexName}
        filters={filters}
        {...props}
      />
    </div>
  );
}


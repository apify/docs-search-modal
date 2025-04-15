import { UiDependencyProvider } from "@apify/ui-library";
import { Footer } from "./Footer";
import { PreviewPanel } from "./PreviewPanel";
import { ResultsItems } from "./ResultsItems";

function getWarningMessage(methodName: string) {
    return `WATCH OUT! ${methodName} prop in @apify/docs-search-modal is not correctly implemented!
If you're seeing this message, it means that you're using components that are trying to access
${methodName}, but the prop is not provided. This is a warning!`;
    
}

export function Modal({state, setActiveItemId, setContext, components, preview}: { state: any, setActiveItemId: any, setContext: any, components: any, preview: any }) {
    return (
        <UiDependencyProvider
            dependencies={
                {
                    InternalImage: (() => console.warn(getWarningMessage('InternalImage'))) as any,
                    InternalLink: (() => console.warn(getWarningMessage('InternalLink'))) as any,
                    isHrefTrusted: (() => {console.warn(getWarningMessage('isHrefTrusted')); return true}) as any,
                    windowLocationHost: window.location.host,
                    uiTheme: document.querySelector('[data-theme="dark"]') ? 'DARK' : 'LIGHT',
                }
            }
            > <div className="flex flex-col h-full bg-white dark:bg-slate-800">
        {state.collections[0].items.length === 0 ? (
        <div className="flex flex-col justify-center items-center flex-1">
            <div className='text-slate-400 font-medium text-lg px-3 py-1'>
            No results :(
            </div>
        </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-1 flex-1 overflow-hidden">
            <div className="h-full overflow-y-scroll resultsItems">
            <ResultsItems {...{ items: state?.collections?.[0]?.items, setActiveItemId, setContext, state, components }} />
            </div>
            <PreviewPanel preview={preview} components={components} />
        </div>
        )}
        <Footer />
    </div>
    </UiDependencyProvider>
  );
}

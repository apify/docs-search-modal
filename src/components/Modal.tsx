import { UiDependencyProvider } from "@apify/ui-library";
import { Footer } from "./Footer";
import { PreviewPanel } from "./PreviewPanel";
import { ResultsItems } from "./ResultsItems";
import { useCallback, useEffect, useState } from "react";

function getWarningMessage(methodName: string) {
    return `WATCH OUT! ${methodName} prop in @apify/docs-search-modal is not correctly implemented!
If you're seeing this message, it means that you're using components that are trying to access
${methodName}, but the prop is not provided. This is a warning!`;

}

export function AskAITab({ currentQuery, setOpen }: { currentQuery?: any, setOpen: (open: boolean) => void }) {
    const [isKapaAIAvailable, setKapaAIAvailable] = useState(true);

    useEffect(() => {
        if (!(window as any).Kapa) {
            setKapaAIAvailable(false);
        }
    }, []);

    const askKapaAI = useCallback(() => {
        setOpen(false);
        (window as any).Kapa.open({ query: currentQuery ?? '', submit: true });
    }, [isKapaAIAvailable, currentQuery]);

    return (
            !isKapaAIAvailable ? null :
            <button
                onClick={askKapaAI}
                style={{ padding: '7px', backgroundColor: 'rgb(234,88,12)', cursor: 'pointer', zIndex: 10000 }}
                className="absolute text-white dark:text-white font-medium rounded-md shadow-lg transition kapa-ai-button bg-orange-500">
                ✨ Ask AI
            </button>
    );
}

export function Modal({state, setActiveItemId, setContext, components, preview}: { state: any, setActiveItemId: any, setContext: any, components: any, preview: any }) {
    return (
        <UiDependencyProvider
            dependencies={
                {
                    InternalImage: (() => { console.warn(getWarningMessage('InternalImage')); return null; }) as any,
                    InternalLink: (() => { console.warn(getWarningMessage('InternalLink')); return null; }) as any,
                    isHrefTrusted: (() => {console.warn(getWarningMessage('isHrefTrusted')); return true}) as any,
                    windowLocationHost: window.location.host,
                    uiTheme: document.querySelector('[data-theme="dark"]') ? 'DARK' : 'LIGHT',
                }
            }
            > <div className="flex flex-col h-full bg-white dark:bg-slate-800 relative">
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

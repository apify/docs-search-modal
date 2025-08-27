import { ArrowDownIcon, ArrowUpIcon, EnterIcon, EscapeIcon } from "../utils/icons";

function Tooltip() {
  return (
    <ul className="flex flex-row list-none space-x-3 mb-0 pl-0 mt-2">
      <li className="space-x-2 text-slate-500 dark:text-slate-300 text-sm flex">
        <kbd className="DocSearch-Button-Key">
          <EnterIcon />
        </kbd>
        <span className="DocSearch-Label">to select
      </span>
    </li>
    <li className="space-x-2 text-slate-500 dark:text-slate-300 text-sm flex">
      <span className="DocSearch-Button-Keys">
        <kbd className="DocSearch-Button-Key" >
          <ArrowUpIcon />
        </kbd>
        <kbd className="DocSearch-Button-Key">
          <ArrowDownIcon />
        </kbd>
      </span>
      <span className="DocSearch-Label">to navigate
      </span>
    </li>
    <li className="space-x-2 text-slate-500 dark:text-slate-300 text-sm flex">
      <kbd className="DocSearch-Button-Key">
         <EscapeIcon />
      </kbd>
      <span className="DocSearch-Label">to close
      </span>
    </li>
    </ul>
    )
  }

  /**
  * Renders the footer of the modal with the Apify logo.
  */
  export function Footer() {
    return (
      <div className='hidden lg:block bg-white dark:bg-slate-900'>
      <div className="flex flex-row justify-between h-16 w-full items-center px-5 shadow-inner">
        <Tooltip />
      </div>
    </div>
    );
  }

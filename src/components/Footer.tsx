/**
 * Renders the footer of the modal with the Apify logo.
 */
export function Footer() {
    return (
      <div className='hidden lg:block'>
        <div className="flex flex-row-reverse h-16 w-full items-center px-5 shadow-inner">
          <img style={{ height: '24px' }} alt="Apify logo" src="https://upload.wikimedia.org/wikipedia/commons/2/28/Apify-logo.svg"/>
        </div>
      </div>
    );
}
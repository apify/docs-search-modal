import { ApifySearch } from  '../../src/index';

function App() {
  return (
    <>
      <ApifySearch 
        algoliaAppId="N8EOCSBQGH"
        algoliaIndexName='test_test_apify_sdk'
        algoliaKey="e97714a64e2b4b8b8fe0b01cd8592870"
      />
    </>
  )
}

export default App

import { Outlet } from 'react-router-dom';
import SearchHeader from './components/SearchHeader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { YoutubeApiProvider } from './context/YoutubeApiContext';
import { DarkModeProvider } from './context/DarkModeContext';
import ScrollToTop from './components/ScrollToTop';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <DarkModeProvider>
        <SearchHeader />
        <ScrollToTop />
        <YoutubeApiProvider>
          <QueryClientProvider client={queryClient}>
            <Outlet />
            <ReactQueryDevtools initialIsOpen={true} />
          </QueryClientProvider>
        </YoutubeApiProvider>
      </DarkModeProvider>
    </>
  );
}

export default App;

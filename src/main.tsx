import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './store/store';
import { router } from './router';
import { DiagnosisProvider } from './hooks/useDiagnosis';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('#root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <Provider store={store}>
      <DiagnosisProvider>
        <RouterProvider router={router} />
      </DiagnosisProvider>
    </Provider>
  </StrictMode>,
);

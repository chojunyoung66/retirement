import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import WelcomeScreen from './screens/WelcomeScreen';
import DiagnosisTypeScreen from './screens/DiagnosisTypeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CashflowInputScreen from './screens/CashflowInputScreen';
import ScenarioScreen from './screens/ScenarioScreen';
import MedicalExpenseScreen from './screens/MedicalExpenseScreen';
import ProjectionScreen from './screens/ProjectionScreen';
import SummaryScreen from './screens/SummaryScreen';
import SignInScreen from './screens/SignInScreen';
import CashFlowPlanScreen from './screens/CashFlowPlanScreen';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <WelcomeScreen /> },
      { path: 'diagnosis', element: <DiagnosisTypeScreen /> },
      { path: 'profile', element: <ProfileScreen /> },
      { path: 'cashflow', element: <CashflowInputScreen /> },
      { path: 'scenario', element: <ScenarioScreen /> },
      { path: 'medical', element: <MedicalExpenseScreen /> },
      {
        path: 'result',
        element: (
          <ProtectedRoute>
            <ProjectionScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: 'summary',
        element: (
          <ProtectedRoute>
            <SummaryScreen />
          </ProtectedRoute>
        ),
      },
      { path: 'signin', element: <SignInScreen /> },
      {
        path: 'cashflow-plan',
        element: (
          <ProtectedRoute>
            <CashFlowPlanScreen />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

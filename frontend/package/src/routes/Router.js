import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Icons = Loadable(lazy(() => import('../views/icons/Icons')))
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')))
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const QuizApp = Loadable(lazy(() => import('../views/quiz-app/QuizApp')));
const LawJournal = Loadable(lazy(() => import('../views/law-journal/LawJournal')));
const PDFManager = Loadable(lazy(() => import('../views/law-journal/PDFManager')));
const PreviousEntries = Loadable(lazy(() => import('../views/law-journal/PreviousEntries')));
const EditEntry= Loadable(lazy(() => import('../views/law-journal/EditEntry')));
const ProfileView = Loadable(lazy(() => import('../layouts/full/header/ProfileView')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/quiz-app', exact: true, element: <QuizApp />},
      {path:'/law-journal', exact: true, element: <LawJournal/>},
      {path:'/previous-entries', exact: true, element: <PreviousEntries/>},
      {path:'/edit-entry/:id', exact: true, element: <EditEntry/>},
      { path: '/pdf-manager', exact: true, element: <PDFManager />},
      { path: '/profile/view', exact: true, element: <ProfileView/>},
      { path: '/icons', exact: true, element: <Icons /> },
      { path: '/ui/typography', exact: true, element: <TypographyPage /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;

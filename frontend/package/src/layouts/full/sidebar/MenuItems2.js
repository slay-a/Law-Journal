import {
  IconAperture,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";
import GavelIcon from "@mui/icons-material/Gavel";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import IconLogout from "@mui/icons-material/Logout"; // Logout icon
import { uniqueId } from "lodash";

const url = import.meta.env.VITE_MIDDLEWARE_URL;

const Menuitems2 = [
  {
    navlabel: true,
    subheader: "Home",
    icon: IconMoodHappy,
    external: false,
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
    external: false,
  },
  {
    navlabel: true,
    subheader: "Journals",
  },
  {
    id: uniqueId(),
    title: "Law Journal",
    icon: MenuBookIcon,
    href: "/law-journal",
    external: false,
  },
  {
    id: uniqueId(),
    title: "Previous Entries",
    icon: IconTypography,
    href: "/previous-entries",
    external: false,
  },
  {
    id: uniqueId(),
    title: "PDF Journal",
    icon: PictureAsPdfIcon,
    href: "/pdf-manager",
    external: false,
  },
  {
    id: uniqueId(),
    title: "Link to LSAT Demon",
    icon: GavelIcon,
    href: "https://lsatdemon.com",
    target: "_blank",
    external: true,
  },
  {
    navlabel: true,
    subheader: "Auth",
  },
  {
    id: uniqueId(),
    title: "Login",
    icon: IconLogin,
    href: "/auth/login",
    external: false,
  },
  {
    id: uniqueId(),
    title: "Register",
    icon: IconUserPlus,
    href: "/auth/register",
    external: false,
  }
];

export default Menuitems2;

// import {
//     IconAperture, IconLayoutDashboard, IconLogin, IconMoodHappy, IconTypography, IconUserPlus
//   } from '@tabler/icons-react';
//   import GavelIcon from '@mui/icons-material/Gavel';
// import MenuBookIcon from '@mui/icons-material/MenuBook';
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//   import { uniqueId } from 'lodash';
  
//   const Menuitems2 = [
//     {
//       navlabel: true,
//       subheader: 'Home',
//       icon: IconMoodHappy,
//       external: false,
//     },
  
//     {
//       id: uniqueId(),
//       title: 'Dashboard',
//       icon: IconLayoutDashboard,
//       href: '/dashboard',
//       external: false,
//     },
//     {
//       navlabel: true,
//       subheader: 'Journals',
//     },
//     // {
//     //   id: uniqueId(),
//     //   title: 'Text Styler',
//     //   icon: IconAperture,
//     //   href: '/sample-page',
//     // },
//     // {
//     //   id: uniqueId(),
//     //   title: 'COMP 324',
//     //   icon: IconTypography,
//     //   href: '/quiz-app',
//     // },
//     {
//       id: uniqueId(),
//       title: 'Law Journal',
//       icon: MenuBookIcon,
//       href: '/law-journal',
//       external: false,
//     },
//     {
//       id: uniqueId(),
//       title: 'Previous Entries',
//       icon: IconTypography,
//       href: '/previous-entries',
//       external: false,
//     },
//     {
//       id: uniqueId(),
//       title: 'PDF Journal',
//       icon: PictureAsPdfIcon,
//       href: '/pdf-manager',
//       external: false,
//     },
//     {
//       id: uniqueId(),
//       title: 'Link to LSAT Demon',
//       icon: GavelIcon,
//       href: 'https://lsatdemon.com',
//       target: '_blank',
//       external: true,
//     },
//     {
//       navlabel: true,
//       subheader: 'Auth',
//     },
//     {
//       id: uniqueId(),
//       title: 'Login',
//       icon: IconLogin,
//       href: '/auth/login',
//       external: false,
//     },
//     {
//       id: uniqueId(),
//       title: 'Register',
//       icon: IconUserPlus,
//       href: '/auth/register',
//       external: false,
//     }
//   ];
  
//   export default Menuitems2;
  
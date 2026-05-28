import React from "react";
import { Toaster } from "react-hot-toast";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./Pages/Dashborad/Dashboard";

// Role
import RoleList from "./Pages/Roles/RoleList";
import CreateRole from "./Pages/Roles/CreateRole";
import UpdateRole from "./Pages/Roles/UpdateRole";

// User
import UserList from "./Pages/User/UserList";
import UserView from "./Pages/User/UserView";
import UserEdit from "./Pages/User/UserEdit";

// match
import MatchList from "./Pages/Match/MatchList";
import MatchView from "./Pages/Match/MatchView";
import ChatHistory from "./Pages/Match/ChatHistory";

// Feedback

import FeedbackList from "./Pages/Feedback/FeedbackList";

//PrivacyPolicy
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";

//term&condition

import TermsAndConditions from "./Pages/TermsAndConditions/TermsAndConditions";

// AboutUs

import AboutUs from "./Pages/AboutUs/AboutUs";

//Meeting
import MeetingList from "./Pages/Meeting/MeetingList";

// // Vehicle Type
// import VehicleTypeList from "./Pages/VehicleType/VehicleTypeList";
// import AddVehicleType from "./Pages/VehicleType/AddVehicleType";
// import UpdateVehicleType from "./Pages/VehicleType/UpdateVehicleType";
// // import ViewVehicleType from "./Pages/VehicleType/ViewVehicleType";

// // Package
// import PackageList from "./Pages/Package/PackageListPage";
// import AddPackage from "./Pages/Package/AddPackage";
// import UpdatePackage from "./Pages/Package/UpdatePackage";

// // Member
// import MemberList from "./Pages/Member/MemberList";
// import CreateMember from "./Pages/Member/CreateMember";
// import UpdateMember from "./Pages/Member/UpdateMember";

import Login from "./Pages/loginpage/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import PageNotFound from "./Pages/PageNotFound";

// // Agent
// import AgentListpage from "./Pages/Agent/AgentListPage";
// import UpdateAgent from "./Pages/Agent/UpdateAgent";
// import ViewAgent from "./Pages/Agent/ViewAgent";
// import AgentCommissionList from "./Pages/Agent/AgentCommissionList";

// // Sos
// import SosList from "./Pages/Sos/SosList";

// //support
// import SupportListPage from "./Pages/Support/SupportListPage";

// //location

// import LocationList from "./Pages/Location/LocationList";
// import CreateLocation from "./Pages/Location/CreateLocation";
// import UpdateLocation from "./Pages/Location/UpdateLocation";
// //Specialization

// // import User from "./Pages/User/User";
// // import UserCreate from "./Pages/User/UserCreate";
// // import UserUpdate from "./Pages/User/UserUpdate";
// // import UserList from "./Pages/User/UserList";

// import RouteMapListPage from "./Pages/RouteMap/RouteMapListPage";
// import AddRouteMap from "./Pages/RouteMap/AddRouteMap";
// import EditRouteMap from "./Pages/RouteMap/EditRouteMap";
// import ViewRouteMap from "./Pages/RouteMap/ViewRouteMap";
// import PackageListPage from "./Pages/Package/PackageListPage";
// import ViewPackage from "./Pages/Package/ViewPackage";
// import SettingsPage from "./Pages/Settings/SettingPage";
// import VehicleListPage from "./Pages/Vehicle/VehicleListPage";
// import AddNewVehicle from "./Pages/Vehicle/AddNewVehicle";
// import UpdateVehiclePage from "./Pages/Vehicle/UpdateVehiclePage";
// import DriverListPage from "./Pages/Driver/DriverListPage";
// import ViewDriverDetailsPage from "./Pages/Driver/ViewDriverDetailsPage";
// import BookingsListPage from "./Pages/Bookings/BookingsListPage";
// import ViewBookingDetails from "./Pages/Bookings/ViewBookingDetails";
// import RedeemAgentList from "./Pages/RedeemAgent/RedeemAgentList";
// import DriverCashCollection from "./Pages/DriverCashCollection/DriverCashCollection";
// Add this import at the top with other page imports
import SubscriptionsList from "./Pages/Subscriptions/SubscriptionsList";
import NotificationList from "./Pages/Notifications/NotificationsListPage";
import EmailTemplate from "./Pages/EmailTemplate/EmailTemplate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/Home",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },

      //User
      { path: "user", element: <UserList /> },
      { path: "user/view/:id", element: <UserView /> },
      { path: "user/edit/:id", element: <UserEdit /> },

      // Role routes
      { path: "role", element: <RoleList /> },
      { path: "role/createrole", element: <CreateRole /> },
      { path: "role/updaterole/:id", element: <UpdateRole /> },

      //match
      { path: "match", element: <MatchList /> },
      { path: "match/view/:id", element: <MatchView /> },
      { path: "match/chat/:matchId", element: <ChatHistory /> },
      // notification
      { path: "notification", element: <NotificationList /> },
      // email template
      { path: "email-template", element: <EmailTemplate /> },
      // Feedback
      { path: "feedback", element: <FeedbackList /> },

      // privacypolicy
      { path: "policy", element: <PrivacyPolicy /> },

      //  termand condtion
      { path: "term&condition", element: <TermsAndConditions /> },

      // Aboutus

      { path: "aboutus", element: <AboutUs /> },

      // Meeting

      { path: "meeting", element: <MeetingList /> },

      // { path: "packagelist", element: <PackageList /> },
      // { path: "packagelist/createpackage", element: <AddPackage /> },
      // { path: "packagelist/view/:id", element: <ViewPackage /> },
      // { path: "packagelist/update/:id", element: <UpdatePackage /> },

      // { path: "supportlist", element: <SupportListPage /> },

      // Subscriptions
      { path: "subscriptions", element: <SubscriptionsList /> },
      // { path: "subscriptions/create", element: <CreateSubscription /> },
      // { path: "subscriptions/edit/:id", element: <EditSubscription /> },
      // { path: "subscriptions/view/:id", element: <ViewSubscription /> },

      // { path: "routeMap", element: <RouteMapListPage /> },
      // { path: "routeMap/create", element: <AddRouteMap /> },
      // { path: "routeMap/update/:id", element: <EditRouteMap /> },
      // { path: "routeMap/view/:id", element: <ViewRouteMap /> },

      // { path: "member", element: <MemberList /> },
      // { path: "member/createmember", element: <CreateMember /> },
      // { path: "member/update/:id", element: <UpdateMember /> },

      // { path: "Location", element: <LocationList /> },
      // { path: "Location/createLocation", element: <CreateLocation /> },
      // { path: "Location/updateLocation/:id", element: <UpdateLocation /> },

      // { path: "VehicleType", element: <VehicleTypeList /> },
      // { path: "VehicleType/createVehicleType", element: <AddVehicleType /> },
      // {
      //   path: "VehicleType/updateVehicleType/:id",
      //   element: <UpdateVehicleType />,
      // },

      // { path: "Agent", element: <AgentListpage /> },
      // { path: "Agent/update/:id", element: <UpdateAgent /> },
      // { path: "Agent/view/:id", element: <ViewAgent /> },
      // { path: "Agent/commissions/:agentId", element: <AgentCommissionList /> },

      // { path: "sos", element: <SosList /> },

      // { path: "*", element: <PageNotFound /> },

      // { path: "RedeemAgent", element: <RedeemAgentList /> },
      // { path: "driverCashCollection", element: <DriverCashCollection /> },

      // { path: "settings", element: <SettingsPage /> },
      // { path: "vehicle", element: <VehicleListPage /> },
      // { path: "vehicle/add", element: <AddNewVehicle /> },
      // { path: "vehicle/update/:id", element: <UpdateVehiclePage /> },

      // { path: "driver", element: <DriverListPage /> },
      // { path: "driver/view/:id", element: <ViewDriverDetailsPage /> },
      // { path: "bookings", element: <BookingsListPage /> },
      // { path: "bookings/view/:id", element: <ViewBookingDetails /> },
    ],
  },

  // ✅ 404 for any top-level unmatched route like /abc
  // {
  //   path: "*",
  //   element: <PageNotFound />,
  // },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;

import {
  faBed,
  faCalendar,
  faFileMedical,
  faPills,
  faRunning,
  faUtensils,
  faWater,
  faWeight,
} from "@fortawesome/free-solid-svg-icons";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./Components/Layout/Navbar";
import store from "./Store/store";
import Dashboard from "./Views/Auth/Dashboard";
import Consumption from "./Views/Auth/Diet/Consumption";
import Schedule from "./Views/Auth/Diet/Schedule";
import Watering from "./Views/Auth/Diet/Watering";
import LabTests from "./Views/Auth/LabTests";
import Manual from "./Views/Auth/Manual";
import MedicineConsumption from "./Views/Auth/Medicine/Consumption";
import MedicineSchedule from "./Views/Auth/Medicine/Schedule";
import SleepCycles from "./Views/Auth/SleepCycles";
import Sports from "./Views/Auth/Sports";
import WeightReadings from "./Views/Auth/WeightReadings";
import Landing from "./Views/Public/Landing";
import Login from "./Views/Public/Login";
import i18n from "./i18n";

export const routes = [
  {
    name: i18n.t("Layout.Diet"),
    path: "diet",
    icon: faUtensils,
    list: [
      {
        name: i18n.t("Layout.Consumption"),
        path: "consumption",
        icon: faUtensils,
        Comp: <Consumption />,
      },
      {
        name: i18n.t("Layout.Schedule"),
        path: "schedule",
        icon: faCalendar,
        Comp: <Schedule />,
      },
      {
        name: i18n.t("Layout.Watering"),
        path: "watering",
        icon: faWater,
        Comp: <Watering />,
      },
    ],
  },
  {
    name: i18n.t("Layout.Sport Sessions"),
    path: "sport-sessions",
    icon: faRunning,
    Comp: <Sports />,
  },
  {
    name: i18n.t("Layout.Sleep Cycles"),
    path: "sleep-cycles",
    icon: faBed,
    Comp: <SleepCycles />,
  },
  {
    name: i18n.t("Layout.Medicine"),
    path: "medicine",
    icon: faPills,
    list: [
      {
        name: i18n.t("Layout.Consumption"),
        path: "consumption",
        icon: faPills,
        Comp: <MedicineConsumption />,
      },
      {
        name: i18n.t("Layout.Schedule"),
        path: "schedule",
        icon: faCalendar,
        Comp: <MedicineSchedule />,
      },
    ],
  },
  {
    name: i18n.t("Layout.Weight Readings"),
    path: "weight-readings",
    icon: faWeight,
    Comp: <WeightReadings />,
  },
  {
    name: i18n.t("Layout.Lab Tests"),
    path: "lab-tests",
    icon: faFileMedical,
    Comp: <LabTests />,
  },
];

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar />

        {store.getState().auth.user ? (
          <Routes>
            {routes.map(({ name, path, Comp, list }, i) =>
              list ? (
                list.map(({ name, path: childPath, Comp }, x) => (
                  <Route path={path + "/" + childPath} element={Comp} key={x} />
                ))
              ) : (
                <Route path={path} element={Comp} key={i} />
              )
            )}

            <Route path="manual" element={<Manual />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        )}
      </BrowserRouter>
    </Provider>
  );
};

export default App;

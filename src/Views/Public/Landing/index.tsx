import {
  faBed,
  faBrain,
  faBullseye,
  faCalculator,
  faChartLine,
  faChartPie,
  faClock,
  faDumbbell,
  faLanguage,
  faLaptopCode,
  faMobileAlt,
  faPills,
  faShield,
  faStarAndCrescent,
  faTint,
  faToilet,
  faUserMd,
  faUsers,
  faUtensils,
  faWeight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";

import FeaturesView from "./FeaturesView";
import PageSection from "./PageSection";

const LandingPage = () => {
  const { t } = useTranslation();

  const currentFeatures = [
    {
      title: t("Services.Diet.Schedule.ScheduleMeals"),
      icon: faUtensils,
      desc: t("Services.Diet.Schedule.Desc"),
    },
    {
      title: t("Services.Diet.Watering.Title"),
      icon: faTint,
      desc: t("Services.Diet.Watering.Desc"),
    },
    {
      title: t("Services.Relief.Relief"),
      icon: faToilet,
      desc: t("Services.Relief.Desc"),
    },
    {
      title: t("Services.Sports.Title"),
      icon: faDumbbell,
      desc: t("Services.Sports.Desc"),
    },
    {
      title: t("Services.Medicine.Title"),
      icon: faPills,
      desc: t("Services.Medicine.Desc"),
    },
    {
      title: t("Services.SleepCycles.Title"),
      icon: faBed,
      desc: t("Services.SleepCycles.Desc"),
    },
    {
      title: t("Services.Diet.Fasting.Fasting"),
      icon: faStarAndCrescent,
      desc: t("Services.Diet.Fasting.Desc"),
    },
    {
      title: t("Services.WeightReadings.Title"),
      icon: faWeight,
      desc: t("Services.WeightReadings.Desc"),
    },
    {
      icon: faShield,
      title: t("Landing.SecuredAccess.Title"),
      desc: t("Landing.SecuredAccess.Desc"),
    },
    {
      icon: faUsers,
      title: t("Landing.OpenSource.Title"),
      desc: t("Landing.OpenSource.Desc"),
    },
    {
      icon: faLaptopCode,
      title: t("Landing.ModernTechStack.Title"),
      desc: t("Landing.ModernTechStack.Desc"),
    },
  ];

  const futurePlans = [
    {
      icon: faMobileAlt,
      title: t("Landing.MobileApp.Title"),
      desc: t("Landing.MobileApp.Desc"),
    },
    {
      icon: faClock,
      title: t("Landing.SetReminders.Title"),
      desc: t("Landing.SetReminders.Desc"),
    },
    {
      icon: faUserMd,
      title: t("Landing.NutritionistAccess.Title"),
      desc: t("Landing.NutritionistAccess.Desc"),
    },
    {
      icon: faBrain,
      title: t("Landing.AiPoweredInput.Title"),
      desc: t("Landing.AiPoweredInput.Desc"),
    },
    {
      icon: faChartLine,
      title: t("Landing.AdvancedAnalytics.Title"),
      desc: t("Landing.AdvancedAnalytics.Desc"),
    },
    {
      icon: faCalculator,
      title: t("Landing.CalorieTracking.Title"),
      desc: t("Landing.CalorieTracking.Desc"),
    },
    {
      icon: faLanguage,
      title: t("Landing.Localization.Title"),
      desc: t("Landing.Localization.Desc"),
    },
    {
      icon: faBullseye,
      title: t("Landing.GoalSetting.Title"),
      desc: t("Landing.GoalSetting.Desc"),
    },
    {
      icon: faUsers,
      title: t("Landing.MultiUserSupport.Title"),
      desc: t("Landing.MultiUserSupport.Desc"),
    },
    {
      icon: faChartPie,
      title: t("Landing.AdvancedDataVisualization.Title"),
      desc: t("Landing.AdvancedDataVisualization.Desc"),
    },
  ];

  const support = [
    t("Landing.TechnicalSupport.Approach1"),
    t("Landing.TechnicalSupport.Approach2"),
    t("Landing.TechnicalSupport.Approach3"),
  ];

  return (
    <div className="container mt-5">
      <header className="text-center py-5 mb-5 row align-items-center">
        <div className="col-md-3 d-flex align-items-center justify-content-center">
          <img src="/Logo.png" className="w-100" alt="Logo" />
        </div>

        <div className="col-md-9 d-flex flex-column align-items-center justify-content-center">
          <h1 className="display-4">{t("Landing.Welcome")}</h1>
          <p className="lead">{t("Landing.Desc")}</p>
        </div>
      </header>

      <FeaturesView
        title={t("Landing.WhatIs.Title")}
        desc={t("Landing.WhatIs.Content")}
        features={currentFeatures}
      />

      <FeaturesView
        title={t("Landing.Future.Title")}
        desc={t("Landing.Future.Content")}
        features={futurePlans}
      />

      <PageSection
        title={t("Landing.StartUsing.Title")}
        desc={t("Landing.StartUsing.Content")}
      />

      <PageSection
        title={t("Landing.TechnicalSupport.Title")}
        desc={t("Landing.TechnicalSupport.Content")}
      >
        <Fragment>
          <ul className="list-group mb-5 text-justify">
            {support.map((point, i) => (
              <li className="list-group-item lh-lg fw-bold" key={i}>
                {point}
              </li>
            ))}
          </ul>

          <h5 className="text-justify">
            {t("Landing.TechnicalSupport.Conclusion")}
          </h5>
        </Fragment>
      </PageSection>

      <PageSection
        title={t("Landing.Contribution.Title")}
        desc={t("Landing.Contribution.Content")}
      >
        <div className="text-center mt-5">
          <a
            className="btn btn-primary btn-lg shadow-sm text-white"
            href="https://github.com/makkahwi/health-empowerment-and-lifestyle"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            {t("Landing.Contribute")}
          </a>
        </div>
      </PageSection>

      <PageSection
        title={t("Landing.Developer.Title")}
        desc={t("Landing.Developer.Content")}
      />
    </div>
  );
};

export default LandingPage;

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as BeAPI from "../../../../API";
import TabsView from "../../../../Components/Layout/TabsView";
import PageSection from "../../../../Components/PageView/PageSection";
import Elements from "./Elements";
import Meals, { SchedulesMealProps } from "./Meals";
import Schedules, { ScheduleProps } from "./Schedules";

const Schedule = () => {
  const { t } = useTranslation();

  const [meals, setMeals] = useState<SchedulesMealProps[]>([]);
  const [schedules, setSchedules] = useState<ScheduleProps[]>([]);

  const getMealsData = () => {
    BeAPI.getAll("scheduleMeals")
      .then((res: SchedulesMealProps[]) =>
        setMeals(
          res
            .sort((a, b) => (a.time < b.time ? -1 : 1))
            .sort((a, b) => (a.schedule < b.schedule ? 1 : -1))
        )
      )
      .catch((err) => console.log({ err }));
  };

  const getSchedulesData = () => {
    BeAPI.getAll("schedules")
      .then((res: ScheduleProps[]) =>
        setSchedules(res.sort((a, b) => (a.order < b.order ? 1 : -1)))
      )
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    getSchedulesData();
    getMealsData();
  }, []);

  const views = [
    {
      title: t("Services.Diet.Schedule.MealElements"),
      view: <Elements meals={meals} schedules={schedules} />,
    },
    {
      title: t("Services.Diet.Schedule.ScheduleMeals"),
      view: <Meals data={meals} schedules={schedules} getData={getMealsData} />,
    },
    {
      title: t("Services.Diet.Schedule.Schedules"),
      view: <Schedules data={schedules} getData={getSchedulesData} />,
    },
  ];

  return (
    <PageSection
      title={t("Services.Diet.Schedule.DietSchedules")}
      desc={t("Services.Diet.Schedule.Desc")}
    >
      <TabsView views={views} />
    </PageSection>
  );
};

export default Schedule;

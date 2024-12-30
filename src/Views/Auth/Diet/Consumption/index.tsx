import moment, { MomentInput } from "moment";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import * as BeAPI from "../../../../API";
import Form from "../../../../Components/Form";
import PageSection from "../../../../Components/PageView/PageSection";
import { units } from "../../../../util/lists";
import { SchedulesMealElementProps } from "../Schedule/Elements";
import { SchedulesMealProps } from "../Schedule/Meals";
import { ScheduleProps } from "../Schedule/Schedules";
import WeeklyCalendar from "./WeeklyCalendar";

export interface consumptionProps {
  id?: string;
  timestamp: MomentInput;
  meal: string;
  note?: string;
  contents: SchedulesMealElementProps[];
  supposed: SchedulesMealElementProps[];
}

export interface consumptionFullProps {
  id?: string;
  timestamp: MomentInput;
  meal: SchedulesMealProps;
  note?: string;
  contents: SchedulesMealElementProps[];
  supposed: SchedulesMealElementProps[];
}

const Consumption = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<consumptionProps[]>([]);
  const [scheduled, setScheduled] = useState<SchedulesMealElementProps[]>([]);
  const [meals, setMeals] = useState<SchedulesMealProps[]>([]);
  const [schedules, setSchedules] = useState<ScheduleProps[]>([]);

  const getData = () => {
    BeAPI.getAll("scheduleMealElements")
      .then((res: SchedulesMealElementProps[]) =>
        setScheduled(res?.sort((a, b) => (a.element > b.element ? 1 : -1)))
      )
      .catch((err) => console.log({ err }));

    BeAPI.getAll("scheduleMeals")
      .then((res: SchedulesMealProps[]) =>
        setMeals(
          res
            .sort((a: SchedulesMealProps, b: SchedulesMealProps) =>
              a.time < b.time ? -1 : 1
            )
            .sort((a: SchedulesMealProps, b: SchedulesMealProps) =>
              a.schedule < b.schedule ? 1 : -1
            )
        )
      )
      .catch((err) => console.log({ err }));

    BeAPI.getAll("schedules")
      .then((res: ScheduleProps[]) =>
        setSchedules(
          res.sort((a: ScheduleProps, b: ScheduleProps) =>
            a.order < b.order ? 1 : -1
          )
        )
      )
      .catch((err) => console.log({ err }));

    BeAPI.getAll("consumed")
      .then((res: consumptionProps[]) =>
        setData(
          res
            ?.sort((a: any, b: any) => (a.timestamp > b.timestamp ? -1 : 1))
            ?.map(({ contents, supposed, ...rest }) => ({
              ...rest,
              contents: contents?.sort((a, b) =>
                a.element > b.element ? 1 : -1
              ),
              supposed: supposed?.sort((a, b) =>
                a.element > b.element ? 1 : -1
              ),
            }))
        )
      )
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    getData();
  }, []);

  const formInputs = [
    {
      name: "date",
      label: t("Services.Diet.Consumption.Date"),
      type: "date",
      required: true,
    },
    {
      name: "time",
      label: t("Services.Diet.Consumption.Time"),
      type: "time",
      required: true,
    },
    {
      name: "meal",
      label: t("Services.Diet.Consumption.MealOfDay"),
      type: "select",
      options: meals
        ?.filter(({ schedule }) => String(schedule) === schedules[0]?.id)
        ?.map(({ id, meal, schedule }) => ({
          value: id || "",
          label:
            meal +
            " of Schedule " +
            schedules.find(({ id }) => id === String(schedule))?.order,
        })),
      onChange: (e: any, setValues: any) => {
        setValues((current: any) => ({
          ...current,
          [e.target.name]: e.target.value,
          contents: scheduled
            ?.filter(({ meal }) => meal === e.target.value)
            .reduce(
              (final: SchedulesMealElementProps[], { alternatives, ...rest }) =>
                alternatives
                  ? [
                      ...final,
                      {
                        ...rest,
                        alternative: t("Services.Diet.Consumption.No"),
                      },
                      ...alternatives.map((x) => ({
                        ...x,
                        alternative: t("Services.Diet.Consumption.Yes"),
                      })),
                    ]
                  : [
                      ...final,
                      {
                        ...rest,
                        alternative: t("Services.Diet.Consumption.No"),
                      },
                    ],
              []
            ),
        }));
      },
      required: true,
    },
    {
      name: "note",
      label: t("Services.Diet.Consumption.Note"),
      fullWidth: true,
    },
    {
      name: "contents",
      label: t("Services.Diet.Consumption.Meal Contents"),
      helpTip:
        "Ensure the name matches the scheduled element exactly for accurate comparisons.",
      type: "dynamicList",
      fullWidth: true,
      inputs: [
        {
          name: "element",
          label: t("Services.Diet.Consumption.Element"),
          required: true,
        },
        {
          name: "count",
          label: t("Services.Diet.Consumption.Quantity"),
          type: "number",
          step: 0.1,
          required: true,
        },
        {
          name: "unit",
          label: t("Services.Diet.Consumption.Unit"),
          required: true,
          type: "select",
          options: units,
        },
        {
          name: "note",
          label: t("Services.Diet.Consumption.Note"),
          required: false,
        },
        {
          name: "alternative",
          label: t("Services.Diet.Consumption.IsAnAlternative"),
          type: "boolean",
          disabled: true,
          required: false,
        },
      ],
      required: true,
    },
  ];

  interface submitProps {
    date: string;
    time: string;
    meal: string;
    note?: string;
    contents: SchedulesMealElementProps[];
    supposed: SchedulesMealElementProps[];
  }

  const onSubmit = (values: submitProps) => {
    const date = values.date || moment().format("yyyy-MM-DD");
    const time = values.time || moment().format("HH:mm");

    const finalValue = {
      meal: values.meal,
      contents: values.contents.map(({ count, ...rest }) => ({
        ...rest,
        count: parseFloat(String(count)),
      })),
      timestamp: moment(date + "T" + time),
      note: values.note,
    };

    BeAPI.create("consumed", finalValue)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));
  };

  const onDelete = (id: string) =>
    BeAPI.remove("consumed", id)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));

  return (
    <PageSection
      title={t("Services.Diet.Consumption.Consumed Meals")}
      desc={t("Services.Diet.Schedule.Desc")}
    >
      <Fragment>
        <Form inputs={formInputs} onSubmit={onSubmit} />

        <WeeklyCalendar
          data={data.map((row) => {
            const mealId = meals.find(({ id }) => (id || "") === row.meal)?.id;

            return {
              ...row,
              supposed: scheduled.filter(({ meal }) => (meal || "") === mealId),
              meal: meals.find(({ id }) => row.meal === id) || {
                id: "string",
                schedule: 0,
                meal: "string",
                time: "string",
              },
            };
          })}
          onDelete={onDelete}
        />
      </Fragment>
    </PageSection>
  );
};

export default Consumption;

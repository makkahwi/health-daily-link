import moment, { Moment } from "moment";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as BeAPI from "../../../API";
import { getSummary } from "../../../API/ChatGPT";
import MealView from "../../../Components/MealView";
import { renderEvents } from "../../../Components/PageView/MonthlyCalendar";
import { consumptionFullProps } from "../Diet/Consumption";
import { renderWateringUI, wateringProps } from "../Diet/Watering";
import { medicineProps, renderMedicineUI } from "../Medicine/Consumption";
import { reliefProps, renderReliefUI } from "../Relief";
import { renderSleepCycleUI, sleepCycleProps } from "../SleepCycles";
import { renderExerciseUI, walkExerciseProps } from "../Sports";
import { fastingProps, renderFastingUI } from "../Diet/Fasting";

export interface SummaryProps {
  date: string;
  week: string;
  daily: { date: string; content: string }[];
}

export type comprehensiveProps = consumptionFullProps & {
  sports: walkExerciseProps[];
  medicines: medicineProps[];
  sleeps: sleepCycleProps[];
  watering: wateringProps[];
  reliefLogs: reliefProps[];
  fasting: fastingProps[];
};

const WeeklyCalendar = ({
  consumptionData,
  walkExercisesData,
  medicineData,
  sleepCyclesData,
  watering,
  reliefLogs,
  fasting,
}: {
  consumptionData: consumptionFullProps[];
  walkExercisesData: walkExerciseProps[];
  medicineData: medicineProps[];
  sleepCyclesData: sleepCycleProps[];
  watering: wateringProps[];
  reliefLogs: reliefProps[];
  fasting: fastingProps[];
}) => {
  const { t } = useTranslation();

  const [currentWeek, setCurrentWeek] = useState<Moment[]>([]);
  const [currentDate, setCurrentDate] = useState<Moment>(moment());
  const [currentWeekData, setCurrentWeekData] = useState<comprehensiveProps[]>(
    []
  );
  const [currentWeekSummary, setCurrentWeekSummary] = useState<SummaryProps>({
    week: "",
    date: "",
    daily: [
      { date: "", content: "" },
      { date: "", content: "" },
      { date: "", content: "" },
      { date: "", content: "" },
      { date: "", content: "" },
      { date: "", content: "" },
      { date: "", content: "" },
    ],
  });

  useEffect(() => {
    generateCurrentWeek(currentDate);
  }, [currentDate]);

  useEffect(() => {
    setCurrentWeekData(
      consumptionData
        ?.filter(({ timestamp }) =>
          moment(timestamp).isBetween(
            moment(currentWeek[0]),
            moment(currentWeek[6]).add(1, "day"),
            undefined,
            "[]"
          )
        )
        .map(({ ...data }) => ({
          ...data,
          sports: walkExercisesData.filter(
            ({ date }) => moment(data.timestamp).format("yyyy-MM-DD") === date
          ),
          medicines: medicineData.filter(
            ({ date }) => moment(data.timestamp).format("yyyy-MM-DD") === date
          ),
          watering: [
            {
              date: moment(data.timestamp).format("yyyy-MM-DD"),
              timestamp: moment(data.timestamp).format("yyyy-MM-DD"),
              quantity: watering
                .filter(
                  ({ timestamp }) =>
                    moment(data.timestamp).format("yyyy-MM-DD") ===
                    moment(timestamp).format("yyyy-MM-DD")
                )
                .map(({ timestamp, ...rest }) => ({
                  ...rest,
                  timestamp,
                  date: moment(timestamp).format("yyyy-MM-DD"),
                }))
                .reduce(
                  (final, { quantity }) =>
                    (final += parseFloat(String(quantity))),
                  0
                ),
            },
          ],
          // .reduce((final, { quantity }) => (final += quantity), 0)
          sleeps: sleepCyclesData.filter(
            ({ endTime }) =>
              moment(data.timestamp).format("yyyy-MM-DD") ===
              moment(endTime).format("yyyy-MM-DD")
          ),
          fasting: fasting.filter(
            ({ date }) =>
              moment(data.timestamp).format("yyyy-MM-DD") ===
              moment(date).format("yyyy-MM-DD")
          ),
          reliefLogs: [
            {
              date: moment(data.timestamp).format("yyyy-MM-DD"),
              time: moment(data.timestamp).format("yyyy-MM-DD"),
              type: "1",
              note: t("Services.Relief.Times", {
                count: reliefLogs
                  .filter(
                    ({ type, time }) =>
                      type == "1" &&
                      moment(data.timestamp).format("yyyy-MM-DD") ===
                        moment(time).format("yyyy-MM-DD")
                  )
                  .map(({ time, ...rest }) => ({
                    ...rest,
                    time,
                    date: moment(time).format("yyyy-MM-DD"),
                  })).length,
              }),
            },
            {
              date: moment(data.timestamp).format("yyyy-MM-DD"),
              time: moment(data.timestamp).format("yyyy-MM-DD"),
              type: "2",
              note: t("Services.Relief.Times", {
                count: reliefLogs
                  .filter(
                    ({ type, time }) =>
                      type == "2" &&
                      moment(data.timestamp).format("yyyy-MM-DD") ===
                        moment(time).format("yyyy-MM-DD")
                  )
                  .map(({ time, ...rest }) => ({
                    ...rest,
                    time,
                    date: moment(time).format("yyyy-MM-DD"),
                  })).length,
              }),
            },
          ].filter(
            ({ note }) =>
              note !==
              t("Services.Relief.Times", {
                count: 0,
              })
          ),
        }))
    );
  }, [
    currentWeek,
    consumptionData,
    walkExercisesData,
    medicineData,
    sleepCyclesData,
  ]);

  const generateSummary = () =>
    getSummary(currentWeekData).then((res) => {
      const data = JSON.parse(res);
      setCurrentWeekSummary(data);
      BeAPI.create("summaries", data).catch((err) => console.log({ err }));
    });

  const generateCurrentWeek = (date: Moment) => {
    // Adjust to get the previous or current Saturday
    const startOfWeek = date.clone().startOf("week").isoWeekday(6);
    const days: Moment[] = [];

    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.clone().add(i, "days"));
    }

    const firstDay = days[0].format("YYYY-MM-DD");

    BeAPI.getAll("summaries")
      .then((res) =>
        setCurrentWeekSummary(res.find(({ date }) => date === firstDay))
      )
      .catch((err) => console.log({ err }));

    setCurrentWeek(days);
  };

  const handlePreviousWeek = () => {
    setCurrentDate(currentDate.clone().subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setCurrentDate(currentDate.clone().add(1, "week"));
  };

  return (
    <div className="overflow-auto">
      <div className="d-flex justify-content-between mb-2">
        <button className="btn btn-primary" onClick={handlePreviousWeek}>
          {t("Dashboard.PreviousWeek")}
        </button>

        <h2 className="text-center">{t("Dashboard.Weekly Calendar")}</h2>

        <button className="btn btn-primary" onClick={handleNextWeek}>
          {t("Dashboard.NextWeek")}
        </button>
      </div>

      <table
        className="table table-bordered table-striped bg-white"
        style={{
          minWidth: "1000px",
        }}
      >
        <thead>
          <tr>
            <th rowSpan={2} className="align-middle" style={{ width: "20%" }}>
              {t("Dashboard.Data")}
            </th>

            {currentWeek?.map((day, i) => (
              <td key={i}>{day.format("ddd")}</td>
            ))}
          </tr>

          <tr>
            {currentWeek?.map((day, i) => (
              <th key={i}>{day.format("D MMM YY")}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {currentWeekData
            ?.map(({ meal }) => meal)
            ?.sort((a: any, b: any) => (a.time < b.time ? -1 : 1))
            ?.map(({ meal }) => meal)
            .reduce<string[]>(
              (final, current) =>
                final.includes(current) ? final : [...final, current],
              []
            )
            ?.map((meal, i) => (
              <tr key={i}>
                <th className="text-start">
                  {meal}

                  {currentWeekData
                    .find((dat) => meal === dat.meal.meal)
                    ?.supposed?.map(
                      ({ element, count, note, unit, alternatives }, y) => (
                        <MealView
                          dark={y % 2 === 1}
                          meal={meal}
                          count={count}
                          unit={unit}
                          element={element}
                          note={note}
                          alternatives={alternatives}
                          key={y}
                        />
                      )
                    ) || ""}
                </th>

                {currentWeek?.map((day, x) => {
                  const theMeals: consumptionFullProps[] | undefined =
                    currentWeekData
                      ?.filter(
                        (dat) =>
                          meal === dat.meal.meal &&
                          moment(dat.timestamp).format("yyyy-MM-DD") ===
                            day.format("yyyy-MM-DD")
                      )
                      ?.sort((a: any, b: any) =>
                        a.timestamp < b.timestamp ? -1 : 1
                      );

                  return (
                    <td className="text-start align-top" key={x}>
                      {theMeals?.map(
                        ({ timestamp, id, note, contents, supposed }) => (
                          <Fragment>
                            {timestamp ? (
                              <span className="d-block bg-dark text-white px-2 py-1">
                                {"@ " + moment(timestamp).format("h:mm a")}{" "}
                                <br />
                                {note ? "(" + note + ")" : ""}
                              </span>
                            ) : (
                              ""
                            )}

                            {contents?.map(
                              ({ element, count, unit, note }, y) => (
                                <MealView
                                  dark={y % 2 === 1}
                                  meal={meal}
                                  count={count}
                                  unit={unit}
                                  element={element}
                                  note={note}
                                  key={y}
                                  supposed={supposed?.find(
                                    (s) =>
                                      s.element === element ||
                                      s.alternatives?.find(
                                        (a) => a.element === element
                                      )
                                  )}
                                  compare
                                />
                              )
                            )}
                          </Fragment>
                        )
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

          <tr>
            <th>{t("Dashboard.Watering")}</th>

            {currentWeek?.map((day, x) => {
              const theRecord: comprehensiveProps | undefined =
                currentWeekData?.find(
                  (dat) =>
                    moment(dat.timestamp).format("yyyy-MM-DD") ===
                    day.format("yyyy-MM-DD")
                );

              return (
                <td className="text-start align-top" key={x}>
                  {renderEvents(
                    day.format("YYYY-MM-DD"),
                    renderWateringUI(),
                    theRecord?.watering
                  )}
                </td>
              );
            })}
          </tr>

          <tr>
            <th>{t("Services.Relief.Relief")}</th>

            {currentWeek?.map((day, x) => {
              const theRecord: comprehensiveProps | undefined =
                currentWeekData?.find(
                  (dat) =>
                    moment(dat.timestamp).format("yyyy-MM-DD") ===
                    day.format("yyyy-MM-DD")
                );

              return (
                <td className="text-start align-top" key={x}>
                  {renderEvents(
                    day.format("YYYY-MM-DD"),
                    renderReliefUI(),
                    theRecord?.reliefLogs.map(({ time, ...rest }) => ({
                      ...rest,
                      date: moment(time).format("yyyy-MM-DD"),
                      time,
                    }))
                  )}
                </td>
              );
            })}
          </tr>

          <tr>
            <th>{t("Services.Diet.Fasting.Fasting")}</th>

            {currentWeek?.map((day, x) => {
              const theRecord: comprehensiveProps | undefined =
                currentWeekData?.find(
                  (dat) =>
                    moment(dat.timestamp).format("yyyy-MM-DD") ===
                    day.format("yyyy-MM-DD")
                );

              return (
                <td className="text-start align-top" key={x}>
                  {renderEvents(
                    day.format("YYYY-MM-DD"),
                    renderFastingUI(),
                    theRecord?.fasting
                  )}
                </td>
              );
            })}
          </tr>

          <tr>
            <th>{t("Dashboard.SportSessions")}</th>

            {currentWeek?.map((day, x) => {
              const theRecord: comprehensiveProps | undefined =
                currentWeekData?.find(
                  (dat) =>
                    moment(dat.timestamp).format("yyyy-MM-DD") ===
                    day.format("yyyy-MM-DD")
                );

              return (
                <td className="text-start align-top" key={x}>
                  {renderEvents(
                    day.format("YYYY-MM-DD"),
                    renderExerciseUI(),
                    theRecord?.sports
                  )}
                </td>
              );
            })}
          </tr>

          <tr>
            <th>{t("Dashboard.Medicines")}</th>

            {currentWeek?.map((day, x) => {
              const theRecord: comprehensiveProps | undefined =
                currentWeekData?.find(
                  (dat) =>
                    moment(dat.timestamp).format("yyyy-MM-DD") ===
                    day.format("yyyy-MM-DD")
                );

              return (
                <td className="text-start align-top" key={x}>
                  {renderEvents(
                    day.format("YYYY-MM-DD"),
                    renderMedicineUI(),
                    theRecord?.medicines
                  )}
                </td>
              );
            })}
          </tr>

          <tr>
            <th>{t("Dashboard.SleepCycles")}</th>

            {currentWeek?.map((day, x) => {
              const theRecord: comprehensiveProps | undefined =
                currentWeekData?.find(
                  (dat) =>
                    moment(dat.timestamp).format("yyyy-MM-DD") ===
                    day.format("yyyy-MM-DD")
                );

              return (
                <td className="text-start align-top" key={x}>
                  {renderEvents(
                    day.format("YYYY-MM-DD"),
                    renderSleepCycleUI(),
                    theRecord?.sleeps.map(({ endTime, ...rest }) => ({
                      ...rest,
                      date: moment(endTime).format("yyyy-MM-DD"),
                      endTime,
                    }))
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <th rowSpan={2}>
              <button
                className="btn btn-primary text-white"
                disabled={currentWeekSummary?.week.length > 0}
                onClick={() => generateSummary()}
              >
                {t("Dashboard.GenerateSummary")}
              </button>
            </th>

            {currentWeek?.map((day, x) => {
              const data = currentWeekSummary?.daily.find(
                ({ date }) =>
                  moment(date).format("yyyy-MM-DD") === day.format("yyyy-MM-DD")
              );

              return <th key={x}>{data?.content}</th>;
            })}
          </tr>

          <tr>
            <th colSpan={7}>{currentWeekSummary?.week}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default WeeklyCalendar;

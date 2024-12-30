import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as BeAPI from "../../API";
import PageSection from "../../Components/PageView/PageSection";
import { wateringProps } from "./Diet/Watering";
import { medicineProps } from "./Medicine/Consumption";
import { medicineScheduleProps } from "./Medicine/Schedule";
import { reliefProps } from "./Relief";
import { fastingProps } from "./Diet/Fasting";

const ShortCuts = () => {
  const { t } = useTranslation();

  const [schedule, setSchedule] = useState<medicineScheduleProps[]>([]);

  const getData = () => {
    BeAPI.getAll("medicine-schedule")
      .then((res: medicineScheduleProps[]) => {
        setSchedule(res);
      })
      .catch((err) => console.log({ err }));
  };

  const submitMedicine = (values: medicineProps) => {
    BeAPI.create("medicine", values).catch((err) => console.log({ err }));
  };

  const submitWatering = (values: wateringProps) => {
    BeAPI.create("watering", values)
      .then(() => {
        getData();
      })
      .catch((err: any) => console.log({ err }));
  };

  const submitRelief = (values: reliefProps) => {
    BeAPI.create("relief", values)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));
  };

  const submitFasting = (values: fastingProps) => {
    BeAPI.create("fasting", values)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    getData();
  }, []);

  const shortcuts = [
    ...schedule.map(({ id, medicine, specs, frequencyQuantity }) => ({
      type: "medicine",
      data: { value: id || "", quantity: frequencyQuantity },
      label: frequencyQuantity + " of " + medicine + " (" + specs + ") ",
    })),
  ];

  return (
    <PageSection title={t("Dashboard.ShortCuts.Just-Consumed Shortcuts")}>
      <Fragment>
        <div className="row align-items-center">
          {/* Water Consumption Actions */}
          <div className={`col-xs-12 col-lg-${2} my-4 text-start`}>
            {t("Dashboard.ShortCuts.Water Consumption")}
          </div>

          <div className={`col-xs-6 col-lg-${2} my-4`}>
            <button
              className="btn btn-primary text-white w-100"
              type="button"
              onClick={() =>
                submitWatering({
                  timestamp: moment().format("yyyy-MM-DDTHH:mm"),
                  quantity: 0.5,
                })
              }
            >
              {t("Dashboard.ShortCuts.Cup", { quantity: 1 / 2 })}
            </button>
          </div>

          <div className={`col-xs-6 col-lg-${2} my-4`}>
            <button
              className="btn btn-primary text-white w-100"
              type="button"
              onClick={() =>
                submitWatering({
                  timestamp: moment().format("yyyy-MM-DDTHH:mm"),
                  quantity: 1,
                })
              }
            >
              {t("Dashboard.ShortCuts.Cup", { quantity: 1 })}
            </button>
          </div>
        </div>

        <div className="row align-items-center">
          {/* Relief Log Actions */}
          <div className={`col-xs-12 col-lg-${2} my-4 text-start`}>
            {t("Services.Relief.Relief")}
          </div>

          <div className={`col-xs-6 col-lg-${2} my-4`}>
            <button
              className="btn btn-primary text-white w-100"
              type="button"
              onClick={() =>
                submitRelief({
                  time: moment().format("yyyy-MM-DDTHH:mm"),
                  type: "1",
                })
              }
            >
              {t("Services.Relief.Number1")}
            </button>
          </div>

          <div className={`col-xs-6 col-lg-${2} my-4`}>
            <button
              className="btn btn-primary text-white w-100"
              type="button"
              onClick={() =>
                submitRelief({
                  time: moment().format("yyyy-MM-DDTHH:mm"),
                  type: "2",
                })
              }
            >
              {t("Services.Relief.Number2")}
            </button>
          </div>
        </div>

        {/* Medicine Consumption Actions */}
        <div className="row align-items-center">
          <div className={`col-xs-12 col-lg-${2} my-4 text-start`}>
            {t("Dashboard.ShortCuts.MedicineConsumption")}
          </div>

          {shortcuts
            .filter(({ type }) => type === "medicine")
            .map(({ label, data }, i) => (
              <div className={`col-xs-6 col-lg-${2} my-4`} key={i}>
                <button
                  className="btn btn-primary text-white w-100"
                  type="button"
                  onClick={() =>
                    submitMedicine({
                      date: moment().format("yyyy-MM-DD"),
                      time: moment().format("HH:mm"),
                      quantity: data.quantity,
                      medicine: data.value,
                    })
                  }
                >
                  {label}
                </button>
              </div>
            ))}
        </div>

        <div className="row align-items-center">
          {/* Fasting Actions */}
          <div className={`col-xs-12 col-lg-${2} my-4 text-start`}>
            {t("Services.Diet.Fasting.Fasting")}
          </div>

          <div className={`col-xs-6 col-lg-${2} my-4`}>
            <button
              className="btn btn-primary text-white w-100"
              type="button"
              onClick={() =>
                submitFasting({
                  date: moment().format("yyyy-MM-DD"),
                  breakTime: moment().format("HH:mm"),
                })
              }
            >
              {t("Services.Diet.Fasting.JustBrokeFasting")}
            </button>
          </div>
        </div>
      </Fragment>
    </PageSection>
  );
};

export default ShortCuts;

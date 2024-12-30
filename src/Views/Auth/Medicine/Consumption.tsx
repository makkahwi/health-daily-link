import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as BeAPI from "../../../API";
import Form from "../../../Components/Form";
import MonthlyCalendar from "../../../Components/PageView/MonthlyCalendar";
import PageSection from "../../../Components/PageView/PageSection";
import { timeFormat } from "../../../Utils/consts";
import { medicineScheduleProps } from "./Schedule";

export interface medicineProps {
  id?: string;
  date: string;
  time: string;
  quantity: number;
  medicine: string;
}

export const renderMedicineUI =
  (onDelete?: Function) => (event: medicineProps, date: string, id: string) =>
    (
      <div>
        {date ? (
          <span className="d-block bg-dark text-white p-2 my-2">
            @ {timeFormat(event.time)}{" "}
            {onDelete && (
              <FontAwesomeIcon
                icon={faTrashCan}
                className="mt-1 text-danger"
                role="button"
                onClick={() => onDelete(id)}
              />
            )}
          </span>
        ) : (
          ""
        )}
        <div className="fw-bold">
          {event.quantity} of {event.medicine}
        </div>
      </div>
    );

const MedicineConsumption = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<medicineProps[]>([]);
  const [schedule, setSchedule] = useState<medicineScheduleProps[]>([]);

  const getData = () => {
    BeAPI.getAll("medicine-schedule")
      .then((res: medicineScheduleProps[]) => {
        setSchedule(res);

        BeAPI.getAll("medicine")
          .then((resp: medicineProps[]) =>
            setData(
              resp
                ?.sort((a: medicineProps, b: medicineProps) =>
                  a.date > b.date ? -1 : 1
                )
                .map(({ medicine, ...rest }) => {
                  const med = res.find(({ id }) => id === medicine);

                  return {
                    ...rest,
                    medicine: med?.medicine + " (" + med?.specs + ")" || "",
                  };
                })
            )
          )
          .catch((err) => console.log({ err }));
      })
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    getData();
  }, []);

  const formInputs = [
    {
      name: "date",
      label: t("Services.Medicine.Date"),
      type: "date",
      required: true,
    },
    {
      name: "time",
      label: t("Services.Medicine.Time"),
      type: "time",
      required: true,
    },
    {
      name: "quantity",
      label: t("Services.Medicine.Quantity"),
      type: "number",
      defaultValue: 1,
      required: true,
    },
    {
      name: "medicine",
      label: t("Services.Medicine.Medicine"),
      type: "select",
      options: schedule.map(({ id, medicine, specs }) => ({
        value: id || "",
        label: medicine + " (" + specs + ")",
      })),
      defaultValue: "Vitamine D",
      required: true,
    },
  ];

  const onSubmit = (values: medicineProps) => {
    BeAPI.create("medicine", values)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));
  };

  const onDelete = (id: string) =>
    BeAPI.remove("medicine", id)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));

  return (
    <PageSection
      title={t("Services.Medicine.ConsumedMedicines")}
      desc={t("Services.Medicine.Desc")}
    >
      <Fragment>
        <Form inputs={formInputs} onSubmit={onSubmit} />

        <MonthlyCalendar data={data} renderEvent={renderMedicineUI(onDelete)} />
      </Fragment>
    </PageSection>
  );
};

export default MedicineConsumption;

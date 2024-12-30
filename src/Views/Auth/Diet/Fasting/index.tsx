import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as BeAPI from "../../../../API";
import Form from "../../../../Components/Form";
import MonthlyCalendar from "../../../../Components/PageView/MonthlyCalendar";
import PageSection from "../../../../Components/PageView/PageSection";
import { dateTotTimeFormat, timeFormat } from "../../../../Utils/consts";
import i18n from "../../../../i18n";

export interface fastingProps {
  id?: string;
  date: string;
  breakTime: string;
  note?: string;
}

export const renderFastingUI =
  (onDelete?: Function) => (event: fastingProps, date: string, id: string) =>
    (
      <div>
        {date ? (
          <span className="d-block bg-dark text-white p-2 my-2">
            {i18n.t("Services.Diet.Fasting.FastBreakingTime")} @{" "}
            {timeFormat(event.breakTime)}{" "}
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
        <small>{event.note}</small>
      </div>
    );

const Fasting = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<fastingProps[]>([]);

  const getData = () =>
    BeAPI.getAll("fasting")
      .then((res: fastingProps[]) =>
        setData(
          res?.sort((a: fastingProps, b: fastingProps) =>
            a.date > b.date ? -1 : 1
          )
        )
      )
      .catch((err) => console.log({ err }));

  useEffect(() => {
    getData();
  }, []);

  const formInputs = [
    {
      name: "date",
      label: t("Services.Diet.Fasting.Date"),
      type: "date",
      required: true,
    },
    {
      name: "breakTime",
      label: t("Services.Diet.Fasting.FastBreakingTime"),
      type: "time",
      required: true,
    },
    {
      name: "note",
      label: t("Services.Diet.Fasting.Notes"),
    },
  ];

  const onSubmit = (values: fastingProps) => {
    BeAPI.create("fasting", values)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));
  };

  const onDelete = (id: string) =>
    BeAPI.remove("fasting", id)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));

  return (
    <PageSection
      title={t("Services.Diet.Fasting.Fasting")}
      desc={t("Services.Diet.Fasting.Desc")}
    >
      <Fragment>
        <Form inputs={formInputs} onSubmit={onSubmit} />

        <MonthlyCalendar data={data} renderEvent={renderFastingUI(onDelete)} />
      </Fragment>
    </PageSection>
  );
};

export default Fasting;

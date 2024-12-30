import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as BeAPI from "../../../API";
import Form from "../../../Components/Form";
import MonthlyCalendar from "../../../Components/PageView/MonthlyCalendar";
import PageSection from "../../../Components/PageView/PageSection";
import { dateTotTimeFormat } from "../../../Utils/consts";
import i18n from "../../../i18n";

export interface reliefProps {
  id?: string;
  time: string;
  type: string;
  note?: string;
}

const reliefOptions = [
  { value: "1", label: i18n.t("Services.Relief.Number1") },
  { value: "2", label: i18n.t("Services.Relief.Number2") },
];

export const renderReliefUI =
  (onDelete?: Function) => (event: reliefProps, date: string, id: string) =>
    (
      <div>
        {date ? (
          <span className="d-block bg-dark text-white p-2 my-2">
            @ {dateTotTimeFormat(event.time)}{" "}
            {onDelete && (
              <FontAwesomeIcon
                icon={faTrashCan}
                className="mt-1 text-danger"
                role="button"
                onClick={() => onDelete(id)}
              />
            )}
            <br />
            {reliefOptions.find(({ value }) => value == event.type)?.label}
          </span>
        ) : (
          ""
        )}
        <small>{event.note}</small>
      </div>
    );

const Relief = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<reliefProps[]>([]);

  const getData = () =>
    BeAPI.getAll("relief")
      .then((res: reliefProps[]) =>
        setData(
          res
            .map(({ time, ...rest }) => ({
              ...rest,
              time,
              date: moment(time).format("yyyy-MM-DD"),
            }))
            ?.sort((a: reliefProps, b: reliefProps) =>
              a.time > b.time ? -1 : 1
            )
        )
      )
      .catch((err) => console.log({ err }));

  useEffect(() => {
    getData();
  }, []);

  const formInputs = [
    {
      name: "time",
      label: t("Services.Relief.Time"),
      type: "datetime-local",
      required: true,
    },
    {
      name: "type",
      label: t("Services.Relief.Type"),
      type: "select",
      options: reliefOptions,
      required: true,
    },
    {
      name: "note",
      label: t("Services.Relief.Notes"),
    },
  ];

  const onSubmit = (values: reliefProps) => {
    BeAPI.create("relief", values)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));
  };

  const onDelete = (id: string) =>
    BeAPI.remove("relief", id)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));

  return (
    <PageSection
      title={t("Services.Relief.Relief")}
      desc={t("Services.Relief.Desc")}
    >
      <Fragment>
        <Form inputs={formInputs} onSubmit={onSubmit} />

        <MonthlyCalendar data={data} renderEvent={renderReliefUI(onDelete)} />
      </Fragment>
    </PageSection>
  );
};

export default Relief;

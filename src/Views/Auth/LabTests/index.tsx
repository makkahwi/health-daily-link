import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as BeAPI from "../../../API";
import PageView from "../../../Components/PageView";

interface props {
  id?: string;
  date: string;
}

const LabTests = () => {
  const { t } = useTranslation();

  const [data, setData] = useState<props[]>([]);

  const getData = () =>
    BeAPI.getAll("labTests")
      .then((res: props[]) =>
        setData(res?.sort((a, b) => (a.date > b.date ? -1 : 1)))
      )
      .catch((err) => console.log({ err }));

  useEffect(() => {
    getData();
  }, []);

  const formInputs = [
    {
      name: "date",
      label: t("Services.LabTests.Date"),
      type: "date",
      required: true,
    },
    {
      name: "tsh",
      label: t("Services.LabTests.TSH"),
      type: "number",
      step: "0.01",
      lowEnd: 0.27,
      highEnd: 5.0,
    },
    {
      name: "sgot",
      label: t("Services.LabTests.SGOT (AST)"),
      type: "number",
      step: "0.01",
      highEnd: 50,
    },
    {
      name: "sgpt",
      label: t("Services.LabTests.SGPT (ALT)"),
      type: "number",
      step: "0.01",
      highEnd: 50,
    },
    {
      name: "ferritin",
      label: t("Services.LabTests.Ferritin"),
      type: "number",
      step: "0.01",
      highEnd: 50,
    },
    {
      name: "sugar",
      label: t("Services.LabTests.FastingBloodSugar"),
      type: "number",
      step: "0.01",
      lowEnd: 70,
      highEnd: 110,
    },
    {
      name: "glucose",
      label: t("Services.LabTests.Glucose"),
      type: "number",
      step: "0.01",
      highEnd: 6.1,
    },
    {
      name: "insulin",
      label: t("Services.LabTests.FastingInsulin"),
      type: "number",
      step: "0.01",
      lowEnd: 1.1,
      highEnd: 17.0,
    },
    {
      name: "insulinResistance",
      label: t("Services.LabTests.InsulinResistance"),
      type: "number",
      step: "0.01",
      highEnd: 2.8,
    },
    {
      name: "cholesterolTotal",
      label: t("Services.LabTests.CholesterolTotal"),
      type: "number",
      step: "0.01",
      highEnd: 190,
    },
    {
      name: "triglycerides",
      label: t("Services.LabTests.Triglycerides"),
      type: "number",
      step: "0.01",
      highEnd: 150,
    },
    {
      name: "cholesterolHdl",
      label: t("Services.LabTests.CholesterolHdl"),
      type: "number",
      step: "0.01",
      lowEnd: 35,
      highEnd: 65,
    },
    {
      name: "cholesterolLdl",
      label: t("Services.LabTests.CholesterolLdl"),
      type: "number",
      step: "0.01",
      highEnd: 130,
    },
    {
      name: "ldl",
      label: t("Services.LabTests.LdlRiskRatioI"),
      type: "number",
      step: "0.01",
      highEnd: 3.22,
    },
    {
      name: "cholesterolT",
      label: t("Services.LabTests.LdlRiskRatioII"),
      type: "number",
      step: "0.01",
      highEnd: 4.44,
    },
    {
      name: "vldl",
      label: t("Services.LabTests.VLDL"),
      type: "number",
      step: "0.01",
      lowEnd: 5,
      highEnd: 40,
    },
    {
      name: "hemoglobin",
      label: t("Services.LabTests.HemoglobinLevel"),
      type: "number",
      step: "0.01",
      lowEnd: 13.2,
      highEnd: 17.3,
    },
    {
      name: "redCellCount",
      label: t("Services.LabTests.RedCellCount"),
      type: "number",
      step: "0.01",
      lowEnd: 4.3,
      highEnd: 5.7,
    },
    {
      name: "hematocrit",
      label: t("Services.LabTests.Hematocrit"),
      type: "number",
      step: "0.01",
      lowEnd: 39,
      highEnd: 49,
    },
    {
      name: "mcv",
      label: t("Services.LabTests.MCV"),
      type: "number",
      step: "0.01",
      lowEnd: 80,
      highEnd: 99,
    },
    {
      name: "mch",
      label: t("Services.LabTests.MCH"),
      type: "number",
      step: "0.01",
      lowEnd: 27,
      highEnd: 34,
    },
    {
      name: "mchc",
      label: t("Services.LabTests.MCHC"),
      type: "number",
      step: "0.01",
      lowEnd: 32,
      highEnd: 37,
    },
    {
      name: "rdwcv",
      label: t("Services.LabTests.RDW-CV"),
      type: "number",
      step: "0.01",
      lowEnd: 11,
      highEnd: 16,
    },
    {
      name: "rdwsd",
      label: t("Services.LabTests.RDW-SD"),
      type: "number",
      step: "0.01",
      lowEnd: 37,
      highEnd: 54,
    },
    {
      name: "whiteCellCount",
      label: t("Services.LabTests.WhiteCellCount"),
      type: "number",
      step: "0.01",
      lowEnd: 5,
      highEnd: 11,
    },
    {
      name: "neutrophils",
      label: t("Services.LabTests.NeutrophilsSegmented"),
      type: "number",
      step: "0.01",
      lowEnd: 2,
      highEnd: 7,
    },
    {
      name: "lymphocytes",
      label: t("Services.LabTests.Lymphocytes"),
      type: "number",
      step: "0.01",
      lowEnd: 0.8,
      highEnd: 4.8,
    },
    {
      name: "monocytes",
      label: t("Services.LabTests.Monocytes"),
      type: "number",
      step: "0.01",
      lowEnd: 0.2,
      highEnd: 1,
    },
    {
      name: "eosinophils",
      label: t("Services.LabTests.Eosinophils"),
      type: "number",
      step: "0.01",
      lowEnd: 80,
      highEnd: 360,
    },
    {
      name: "basophils",
      label: t("Services.LabTests.Basophils"),
      type: "number",
      step: "0.01",
      lowEnd: 0,
      highEnd: 1,
    },
    {
      name: "plateletsCount",
      label: t("Services.LabTests.PlateletsCount"),
      type: "number",
      step: "0.01",
      lowEnd: 150,
      highEnd: 450,
    },
    {
      name: "mpv",
      label: t("Services.LabTests.MPV"),
      type: "number",
      step: "0.01",
      lowEnd: 0.8,
      highEnd: 12,
    },
    {
      name: "serum",
      label: t("Services.LabTests.Serum"),
      type: "number",
      step: "0.01",
      lowEnd: 12.5,
      highEnd: 32.2,
    },
    {
      name: "transferrin",
      label: t("Services.LabTests.Transferrin"),
      type: "number",
      step: "0.01",
      lowEnd: 2.0,
      highEnd: 3.6,
    },
    {
      name: "tibc",
      label: t("Services.LabTests.TIBC"),
      type: "number",
      step: "0.01",
      lowEnd: 45,
      highEnd: 80,
    },
    {
      name: "urea",
      label: t("Services.LabTests.Urea"),
      type: "number",
      step: "0.01",
      lowEnd: 2.8,
      highEnd: 7.2,
    },
    {
      name: "Creatinine",
      label: t("Services.LabTests.Creatinine"),
      type: "number",
      step: "0.01",
      lowEnd: 59,
      highEnd: 104,
    },
    {
      name: "uricAcid",
      label: t("Services.LabTests.UricAcid"),
      type: "number",
      step: "0.01",
      lowEnd: 208,
      highEnd: 428,
    },
    {
      name: "sodium",
      label: t("Services.LabTests.Sodium"),
      type: "number",
      step: "0.01",
      lowEnd: 136,
      highEnd: 146,
    },
    {
      name: "potassium",
      label: t("Services.LabTests.Potassium"),
      type: "number",
      step: "0.01",
      lowEnd: 3.5,
      highEnd: 5.1,
    },
    {
      name: "chloride",
      label: t("Services.LabTests.Chloride"),
      type: "number",
      step: "0.01",
      lowEnd: 101,
      highEnd: 109,
    },
    {
      name: "calcium",
      label: t("Services.LabTests.Calcium"),
      type: "number",
      step: "0.01",
      lowEnd: 2.2,
      highEnd: 2.65,
    },
    {
      name: "correctedCalcium",
      label: t("Services.LabTests.CorrectedCalcium"),
      type: "number",
      step: "0.01",
      lowEnd: 2.1,
      highEnd: 2.6,
    },
    {
      name: "phosphorus",
      label: t("Services.LabTests.Phosphorus"),
      type: "number",
      step: "0.01",
      lowEnd: 0.81,
      highEnd: 1.45,
    },
    {
      name: "magnesium",
      label: t("Services.LabTests.Magnesium"),
      type: "number",
      step: "0.01",
      lowEnd: 0.73,
      highEnd: 1.06,
    },
    {
      name: "bilirubin",
      label: t("Services.LabTests.Bilirubin"),
      type: "number",
      step: "0.01",
      lowEnd: 5,
      highEnd: 21,
    },
    {
      name: "protein",
      label: t("Services.LabTests.Protein"),
      type: "number",
      step: "0.01",
      lowEnd: 66,
      highEnd: 83,
    },
    {
      name: "albumin",
      label: t("Services.LabTests.Albumin"),
      type: "number",
      step: "0.01",
      lowEnd: 32,
      highEnd: 52,
    },
    {
      name: "globulin",
      label: t("Services.LabTests.Globulin"),
      type: "number",
      step: "0.01",
      lowEnd: 21,
      highEnd: 40,
    },
    {
      name: "agRatio",
      label: t("Services.LabTests.A/gRatio"),
      type: "number",
      step: "0.01",
      lowEnd: 1.0,
      highEnd: 2.2,
    },
    {
      name: "phosphatase",
      label: t("Services.LabTests.Phosphatase"),
      type: "number",
      step: "0.01",
      lowEnd: 43,
      highEnd: 115,
    },
    {
      name: "ggt",
      label: t("Services.LabTests.GGT"),
      type: "number",
      step: "0.01",
      highEnd: 55,
    },
    {
      name: "vitamineB12",
      label: t("Services.LabTests.VitamineB12"),
      type: "number",
      step: "0.01",
      lowEnd: 180,
      highEnd: 914,
    },
    {
      name: "vitamineD",
      label: t("Services.LabTests.VitamineD"),
      type: "number",
      step: "0.01",
      lowEnd: 30,
    },
  ];

  const onSubmit = (values: props) => {
    const finalValues = Object.keys(values)
      .filter((key) => (values as any)[key])
      .reduce((final, key) => ({ ...final, [key]: (values as any)[key] }), {});

    BeAPI.create("labTests", finalValues)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));
  };

  const onDelete = (id: string) =>
    BeAPI.remove("labTests", id)
      .then(() => {
        getData();
      })
      .catch((err) => console.log({ err }));

  return (
    <PageView
      title={t("Services.LabTests.LabTestsList")}
      desc={t("Services.LabTests.Desc")}
      data={data}
      inputs={formInputs}
      onSubmit={onSubmit}
      onDelete={onDelete}
    />
  );
};

export default LabTests;

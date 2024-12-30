import { Fragment } from "react";

import Form, { inputProps } from "../../Components/Form";
import PageSection from "./PageSection";
import PageTable from "./Table";

interface props {
  title: string;
  desc?: string;
  data: { id?: string }[];
  inputs: inputProps[];
  onSubmit: (x: any) => void;
  onDelete: Function;
}

const PageView = ({ title, desc, data, inputs, onSubmit, onDelete }: props) => {
  return (
    <PageSection title={title} desc={desc}>
      <Fragment>
        <Form inputs={inputs} onSubmit={onSubmit} />

        <PageTable data={data} inputs={inputs} onDelete={onDelete} />
      </Fragment>
    </PageSection>
  );
};

export default PageView;

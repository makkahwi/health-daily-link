const PageSection = ({ children = <></>, title = "", desc = "" }) => {
  return (
    <section className="my-5">
      <h3 className="mb-3 text-start">{title}</h3>

      <h6 className="mb-5 text-start">{desc}</h6>

      {children}
    </section>
  );
};

export default PageSection;

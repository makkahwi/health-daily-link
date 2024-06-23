import { useEffect, useState } from "react";
import * as consumptionAPI from "../../API/consumption";
import MealView, { MealViewProps } from "../../Components/MealView";
import PageSection from "../../Components/PageSection";
import moment, { MomentInput } from "moment";

interface props {
  timestamp: MomentInput;
  meal: string;
  contents: MealViewProps[];
  supposed: MealViewProps[];
}

const Consumption = () => {
  const [data, setData] = useState<props[]>([]);

  useEffect(() => {
    // consumptionAPI.getAll().then((res: MealViewProps[][]) => setData(res));
    setData(consumptionAPI.getAll());
  }, []);

  return (
    <PageSection title="Consumed Meals">
      <table className="table table-responsive table-striped">
        <thead>
          <tr className="align-middle">
            <th>Date</th>

            <th>Time</th>

            <th>Meal of Day</th>

            <th>Consumed Meal Contents</th>

            <th>Supposed To Consume Meal Contents</th>

            <th>Missed Supposes</th>

            <th>Added Consumptions</th>
          </tr>
        </thead>

        <tbody>
          {data.map(({ timestamp, meal, contents, supposed }, x) => (
            <tr key={x}>
              <td>{moment(timestamp).format("ddd, D MMM YYYY")}</td>
              <td>{moment(timestamp).format("h:mm a")}</td>
              <td>{meal}</td>

              <td>
                <ul className="text-start">
                  {contents.map(({ element, count }, y) => (
                    <MealView count={count} element={element} key={y} />
                  ))}
                </ul>
              </td>

              <td>
                <ul className="text-start">
                  {supposed.map(({ element, count, alternatives }, y) => (
                    <MealView
                      count={count}
                      element={element}
                      alternatives={alternatives}
                      key={y}
                    />
                  ))}
                </ul>
              </td>

              <td>
                <ul className="text-start">
                  {contents
                    .filter(
                      ({ element, count }) =>
                        element !==
                          supposed.find((sup) => sup.element === element)
                            ?.element ||
                        count !==
                          supposed.find((sup) => sup.element === element)?.count
                    )
                    .map(({ element, count }, y) => (
                      <MealView count={count} element={element} key={y} />
                    ))}
                </ul>
              </td>

              <td>
                <ul className="text-start">
                  {supposed
                    .filter(
                      ({ element, count }) =>
                        element !==
                          contents.find((cont) => cont.element === element)
                            ?.element ||
                        count !==
                          contents.find((cont) => cont.element === element)
                            ?.count
                    )
                    .map(({ element, count, alternatives }, y) => (
                      <MealView
                        count={count}
                        element={element}
                        alternatives={alternatives}
                        key={y}
                      />
                    ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageSection>
  );
};

export default Consumption;

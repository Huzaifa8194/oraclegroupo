import dynamic from "next/dynamic";
const Counter = dynamic(() => import("./Counter"), {
  ssr: false,
});

const OrgariumCounter = () => {
  return (
    <div className="row">
      <div className="col-lg-3 col-md-6 col-sm-12 counter-item">
        <div className="counter-inner">
          <div className="text">
            <h2 className="number">
              <Counter end={0.069} decimals={3} />
            </h2>
            <p>$ Per kWh</p>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12 counter-item">
        <div className="counter-inner">
          <div className="text">
            <h2 className="number">
              <Counter end={15} />+
            </h2>
            <p>Years of Experience</p>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12 counter-item">
        <div className="counter-inner">
          <div className="text">
            <h2 className="number">
              <Counter end={12} />+
            </h2>
            <p>Countries</p>
          </div>
        </div>
      </div>
      <div className="col-lg-3 col-md-6 col-sm-12 counter-item">
        <div className="counter-inner">
          <div className="text">
            <h2 className="number">
              <Counter end={25} />+
            </h2>
            <p>Partners</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrgariumCounter;

export const OrgariumCounter2 = () => (
  <div className="row">
    <div className="col-lg-3 col-md-6 col-sm-12">
      <div className="single-counter-item mb-40">
        <div className="text">
          <h2 className="number">
            <Counter end={3652} />+
          </h2>
          <p>Saticfied Clients</p>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-md-6 col-sm-12">
      <div className="single-counter-item mb-40">
        <div className="text">
          <h2 className="number">
            <Counter end={896} />+
          </h2>
          <p>Saticfied Clients</p>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-md-6 col-sm-12">
      <div className="single-counter-item mb-40">
        <div className="text">
          <h2 className="number">
            <Counter end={945} />+
          </h2>
          <p>Saticfied Clients</p>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-md-6 col-sm-12">
      <div className="single-counter-item mb-40">
        <div className="text">
          <h2 className="number">
            <Counter end={565} />+
          </h2>
          <p>Saticfied Clients</p>
        </div>
      </div>
    </div>
  </div>
);

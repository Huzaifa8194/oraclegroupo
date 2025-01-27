import Layout from "../src/layouts/Layout";

const Cancel = () => {
  return (
    <Layout>
      <div className="cancel-page">
        <h1>Payment Cancelled</h1>
        <p>Your payment was not completed. Please try again.</p>
      </div>
    </Layout>
  );
};

export default Cancel;

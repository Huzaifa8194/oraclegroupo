import Layout from "../src/layouts/Layout";
import { useRouter } from "next/router";

const Cancel = () => {
  const router = useRouter();

  return (
    <Layout header={4} footer>
      <div
        className="cancel-page-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          padding: "20px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          className="cancel-content"
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#dc3545", marginBottom: "20px" }}>Payment Cancelled</h2>
          <p
            style={{
              fontSize: "1.1em",
              color: "#6c757d",
              lineHeight: "1.5",
            }}
          >
            Your payment was not completed. If this was a mistake, please try again. 
            If you need help, feel free to contact our support team.
          </p>
          <button
            className="main-btn bordered-btn mt-4"
            style={{
              padding: "10px 20px",
              fontSize: "1em",
              border: "2px solid #007bff",
              borderRadius: "5px",
              backgroundColor: "#fff",
              color: "#007bff",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={() => router.push("/checkout")}
          >
            Try Again
          </button>
          <button
            className="main-btn bordered-btn mt-4"
            style={{
              padding: "10px 20px",
              fontSize: "1em",
              border: "2px solid #6c757d",
              borderRadius: "5px",
              backgroundColor: "#fff",
              color: "#6c757d",
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Cancel;

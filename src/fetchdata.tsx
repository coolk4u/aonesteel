import { useEffect, useState } from "react";
import axios from "axios";

interface OpportunityRecord {
  Id: string;
  Name: string;
  StageName?: string;
  CloseDate?: string;
}

const FetchData = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Get Access Token
  const getAccessToken = async () => {
    const salesforceUrl =
      "https://gtm3.my.salesforce.com/services/oauth2/token";
    const clientId =
      "3MVG99AeQQhMVo3Q02nv1bpvla_Oe75wo1PGrCKO5InOsguy5GAvrHaL3N1coTyJFfCd0Ho6w51Ckyv9.rAVP";
    const clientSecret =
      "5759B3830FBA3FBEA97ECCB0E614F846A4650FC156E47084F213A47BF6EDF92F";

    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    try {
      const response = await axios.post(salesforceUrl, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setAccessToken(response.data.access_token);
      console.log("✅ Access Token:", response.data.access_token);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";

      console.error("❌ Error fetching access token:", errorMessage);
      setError("Failed to fetch access token.");
    }
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const query = `SELECT Id,Name FROM Account`;
        const encodedQuery = encodeURIComponent(query);
        const queryUrl = `https://gtm3.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

        const response = await axios.get(queryUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        const records: OpportunityRecord[] = response.data.records;

        if (records && records.length > 0) {
          console.log("📦 Fetched Opportunities:", records);
          console.table(records);
        } else {
          console.log("ℹ️ No opportunity records found.");
        }
      } catch (err: unknown) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : "Unknown error occurred";

        console.error("❌ Error fetching data:", errorMessage);
        setError("Failed to fetch data from Salesforce.");
      }
    };

    fetchData();
  }, [accessToken]);

  return null; // No UI
};

export default FetchData;

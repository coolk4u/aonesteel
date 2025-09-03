import { useEffect, useState } from 'react';
import axios from 'axios';

interface OpportunityRecord {
  Id: string;
  Name: string;
  Account?: {
    Phone?: string;
  };
  Scheduled_Date_Time__c?: string;
  StageName?: string;
  Manager_Approved__c?: boolean;
  Expected_Discount__c?: number;
  Manager_Comments__c?: string;
  Approved_Date__c?: string;
  Converted_Lead__r?: {
    ProductInterest__c?: string;
  };
}

const FetchData = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Get Access Token
  const getAccessToken = async () => {
    const salesforceUrl = 'https://pde3-dev-ed.develop.my.salesforce.com/services/oauth2/token';
    const clientId = '3MVG97z4K_iuCemhaHjeuAp6A5jpAuMB31Trve1nd0TZAeH7onoyc.LAATp2pnK2Ag3kaMYorR4Np7E7XgMa9';
    const clientSecret = '49C874D60D67C1A6BF3B31213B2F924747A0D27CBEFD2ACEDE0751E20FFFEAA7';

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    try {
      const response = await axios.post(salesforceUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      setAccessToken(response.data.access_token);
      console.log('✅ Access Token:', response.data.access_token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('❌ Error fetching access token:', err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.error('❌ Error fetching access token:', err.message);
      } else {
        console.error('❌ Unknown error fetching access token:', err);
      }
      setError('Failed to fetch access token.');
    }
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const query = `
          SELECT OrderNumber, Status, EffectiveDate, AccountId,
    (SELECT Quantity, UnitPrice, TotalPrice,
            PricebookEntry.Product2.Name,
            PricebookEntry.Product2.ProductCode,
            PricebookEntry.Product2.Description
     FROM OrderItems)
FROM Order
WHERE CreatedDate = TODAY
LIMIT 200

        `.replace(/\s+/g, '+'); // Convert to URL-safe format

        const queryUrl = `https://pde3-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${query}`;

        const response = await axios.get(queryUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const records: OpportunityRecord[] = response.data.records;

        if (records && records.length > 0) {
          console.log('📦 Fetched Opportunities:', records);
          console.table(records);
        } else {
          console.log('ℹ️ No opportunity records found.');
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error('❌ Error fetching data:', err.response?.data || err.message);
        } else if (err instanceof Error) {
          console.error('❌ Error fetching data:', err.message);
        } else {
          console.error('❌ Unknown error fetching data:', err);
        }
        setError('Failed to fetch data from Salesforce.');
      }
    };

    fetchData();
  }, [accessToken]);

  return null; // No UI
};

export default FetchData;

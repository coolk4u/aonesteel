import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Plus,
  Eye,
  Edit,
  Star,
} from "lucide-react";

interface ProjectSiteRecord {
  Id: string;
  Name: string;
  Location__Street__s?: string;
  Location__City__s?: string;
  Location__CountryCode__s?: string;
  Location__PostalCode__s?: string;
  Start_Date__c?: string;
  Is_Existing_Customer__c?: boolean;
  Status__c?: string;
  Builder_Account__r?: {
    Name: string;
  };
  Field_Visits__r?: {
    records: Array<{
      Id: string;
      Field_Officer__c: string;
      Check_In__c: string;
      Check_Out__c: string;
    }>;
  };
}

const Visit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [projectSites, setProjectSites] = useState<ProjectSiteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Get Access Token
  const getAccessToken = async () => {
    const salesforceUrl =
      "https://aonesteelgroup-dev-ed.develop.my.salesforce.com/services/oauth2/token";
    const clientId =
      "3MVG9XDDwp5wgbs0GBXn.nVBDZ.vhpls3uA9Kt.F0F5kdFtHSseF._pbUChPd76LvA0AdGGrLu7SfDmwhvCYl";
    const clientSecret =
      "D63B980DDDE3C45170D6F9AE12215FCB6A7490F97E383E579BE8DEE427A0D891";

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
      return response.data.access_token;
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";

      console.error("❌ Error fetching access token:", errorMessage);
      setError("Failed to fetch access token.");
      return null;
    }
  };

  // Step 2: Fetch data from Salesforce
  const fetchData = async (token: string) => {
    try {
      const query = `SELECT Id, Name, Location__Street__s, Location__City__s, Location__CountryCode__s, 
       Location__PostalCode__s, Start_Date__c, Is_Existing_Customer__c, Status__c, 
       Field_Officer__r.Name, 
       (SELECT Id, Field_Officer__c, Check_In__c, Check_Out__c FROM Field_Visits__r)
FROM Project_Site__c
WHERE Id IN (
    SELECT Project_Site__c 
    FROM ProjectDistributor__c 
    WHERE Distributor__r.Name = 'GR Trading Company'
)`;
      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `https://aonesteelgroup-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const records: ProjectSiteRecord[] = response.data.records;

      if (records && records.length > 0) {
        console.log("📦 Fetched Project Sites:", records);
        setProjectSites(records);
      } else {
        console.log("ℹ️ No project site records found.");
      }
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";

      console.error("❌ Error fetching data:", errorMessage);
      setError("Failed to fetch data from Salesforce.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      const token = await getAccessToken();
      if (token) {
        await fetchData(token);
      } else {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const filteredSites = projectSites.filter(
    (site) =>
      site.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (site.Builder_Account__r?.Name &&
        site.Builder_Account__r.Name.toLowerCase().includes(
          searchTerm.toLowerCase()
        ))
  );

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatAddress = (site: ProjectSiteRecord) => {
    const parts = [
      site.Location__Street__s,
      site.Location__City__s,
      site.Location__PostalCode__s,
      site.Location__CountryCode__s,
    ].filter((part) => part);

    return parts.join(", ") || "Address not available";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Sites</h1>
            <p className="text-gray-600">
              Manage your project sites and field visits
            </p>
          </div>
          <Button className="bg-gradient-to-br from-red-800 via-red-600 to-red-900">
            <Plus className="h-4 w-4 mr-2" />
            Add New Site
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sites</p>
                  <p className="text-2xl font-bold">{projectSites.length}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Sites</p>
                  <p className="text-2xl font-bold">
                    {
                      projectSites.filter((site) => site.Status__c === "Active")
                        .length
                    }
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Existing Customers</p>
                  <p className="text-2xl font-bold">
                    {
                      projectSites.filter(
                        (site) => site.Is_Existing_Customer__c
                      ).length
                    }
                  </p>
                </div>
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Phone className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Field Visits</p>
                  <p className="text-2xl font-bold">
                    {projectSites.reduce(
                      (total, site) =>
                        total + (site.Field_Visits__r?.records?.length || 0),
                      0
                    )}
                  </p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Site List</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Details</TableHead>
                  <TableHead>Dealer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Field Visits</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.length > 0 ? (
                  filteredSites.map((site) => (
                    <TableRow key={site.Id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{site.Name}</p>
                          <p className="text-sm text-gray-500">
                            {site.Start_Date__c
                              ? new Date(
                                  site.Start_Date__c
                                ).toLocaleDateString()
                              : "No start date"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {site.Builder_Account__r?.Name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start">
                          <MapPin className="h-3 w-3 mt-1 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="text-sm">{formatAddress(site)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(site.Status__c)}>
                          {site.Status__c || "Unknown"}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {site.Is_Existing_Customer__c
                            ? "Existing Customer"
                            : "New Customer"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">
                            {site.Field_Visits__r?.records?.length || 0} visits
                          </p>
                          {site.Field_Visits__r?.records &&
                            site.Field_Visits__r.records.length > 0 && (
                              <p className="text-xs text-gray-500">
                                Last:{" "}
                                {new Date(
                                  site.Field_Visits__r.records[0].Check_In__c
                                ).toLocaleDateString()}
                              </p>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No project sites found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Visit;

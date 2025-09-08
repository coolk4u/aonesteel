import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
 TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Download,
  Upload
} from "lucide-react";

interface InventoryRecord {
  Id: string;
  Name: string;
  Product__r: {
    Name: string;
  };
  Category__c: string;
  Current_Stock__c: number;
  Status__c: string;
  Minimum_Stock__c: number;
  Unit_Price__c: number;
  Inventory_Value__c: number;
}

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryRecord[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";
      console.error("❌ Error fetching access token:", errorMessage);
      setError("Failed to fetch access token.");
    }
  };

  // Step 2: Fetch Inventory Data
  const fetchInventoryData = async () => {
    if (!accessToken) return;

    try {
      const query = `SELECT Id, Name, Product__r.Name, Category__c, Current_Stock__c, Status__c, Minimum_Stock__c, Unit_Price__c, Inventory_Value__c, Last_Updated__c FROM Inventory__c where Distributor_Name__r.Name = 'GR Trading Company'`;
      const encodedQuery = encodeURIComponent(query);
      const queryUrl = `https://aonesteelgroup-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${encodedQuery}`;

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const records: InventoryRecord[] = response.data.records;
      setInventoryItems(records);
      setLoading(false);
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || err.message
        : "Unknown error occurred";
      console.error("❌ Error fetching data:", errorMessage);
      setError("Failed to fetch data from Salesforce.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchInventoryData();
    }
  }, [accessToken]);

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock": return "bg-green-100 text-green-800";
    case "Low Stock": return "bg-yellow-100 text-yellow-800";
    case "Out of Stock": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

  const getStockPercentage = (current: number, min: number) => {
    const max = min * 3; // Assuming max stock is 3x min stock
    return Math.round((current / max) * 100);
  };

  // Filter inventory items based on search term
  const filteredInventory = inventoryItems.filter(item =>
    (item.Product__r?.Name || item.Name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Category__c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary statistics
  const totalItems = inventoryItems.reduce((sum, item) => sum + (item.Current_Stock__c || 0), 0);
  const lowStockItems = inventoryItems.filter(item => 
    item.Status__c === "Low Stock" || (item.Current_Stock__c || 0) <= (item.Minimum_Stock__c || 0)
  ).length;
  const outOfStockItems = inventoryItems.filter(item => 
    (item.Current_Stock__c || 0) === 0
  ).length;
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + (item.Inventory_Value__c || 0), 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading inventory data...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error}</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Track your stock levels and movements</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Stock Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-2" />
              Update Stock Levels
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold">{inventoryItems.length}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Stock</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock Alert</p>
                  <p className="text-2xl font-bold text-yellow-600">{lowStockItems}</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Inventory Value</p>
                  <p className="text-2xl font-bold">₹{totalInventoryValue.toFixed(2)}</p>
                </div>
                <div className="bg-red-100 p-2 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Inventory Overview</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
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
                  <TableHead>Product Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  {/* <TableHead>Stock Level</TableHead> */}
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Inventory Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.Id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.Product__r?.Name || item.Name}</p>
                        <p className="text-sm text-gray-500">{item.Name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.Category__c}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.Current_Stock__c || 0}</p>
                        <p className="text-xs text-gray-500">Min: {item.Minimum_Stock__c || 0}</p>
                      </div>
                    </TableCell>
                    {/* <TableCell>
                      <div className="space-y-1">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              getStockPercentage(item.Current_Stock__c || 0, item.Minimum_Stock__c || 1) > 50 ? 'bg-green-500' :
                              getStockPercentage(item.Current_Stock__c || 0, item.Minimum_Stock__c || 1) > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${getStockPercentage(item.Current_Stock__c || 0, item.Minimum_Stock__c || 1)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {getStockPercentage(item.Current_Stock__c || 0, item.Minimum_Stock__c || 1)}%
                        </p>
                      </div>
                    </TableCell> */}
                    <TableCell>₹{item.Unit_Price__c?.toFixed(2)}</TableCell>
                    <TableCell>₹{item.Inventory_Value__c?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.Status__c)}>
                        {item.Status__c}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
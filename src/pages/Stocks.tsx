import { useEffect, useState } from "react";
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
  id: string;
  name: string;
  productName: string;
  category: string;
  currentStock: number;
  status: string;
  minimumStock: number;
  unitPrice: number;
  inventoryValue: number;
  sku: string;
}

// Dummy data in JSON format
const DUMMY_INVENTORY_DATA: InventoryRecord[] = [
  {
    id: "1",
    name: "Steel Rod 12mm",
    productName: "Construction Steel Rod",
    category: "Construction Materials",
    currentStock: 1500,
    status: "In Stock",
    minimumStock: 500,
    unitPrice: 850,
    inventoryValue: 1275000,
    sku: "STRD-12MM-001"
  },
  {
    id: "2",
    name: "Galvanized Sheet",
    productName: "GI Sheet 2mm",
    category: "Sheets & Plates",
    currentStock: 80,
    status: "Low Stock",
    minimumStock: 100,
    unitPrice: 1200,
    inventoryValue: 96000,
    sku: "GSHT-2MM-002"
  },
  {
    id: "3",
    name: "Steel Pipe 4 inch",
    productName: "Seamless Steel Pipe",
    category: "Pipes & Tubes",
    currentStock: 0,
    status: "Out of Stock",
    minimumStock: 50,
    unitPrice: 2500,
    inventoryValue: 0,
    sku: "SPPE-4IN-003"
  },
  {
    id: "4",
    name: "Angle Iron 50x50",
    productName: "MS Angle Iron",
    category: "Structural Steel",
    currentStock: 2200,
    status: "In Stock",
    minimumStock: 300,
    unitPrice: 650,
    inventoryValue: 1430000,
    sku: "ANGI-5050-004"
  },
  {
    id: "5",
    name: "Wire Mesh",
    productName: "Welded Wire Mesh",
    category: "Wire Products",
    currentStock: 120,
    status: "Low Stock",
    minimumStock: 150,
    unitPrice: 450,
    inventoryValue: 54000,
    sku: "WMES-6MM-005"
  },
  {
    id: "6",
    name: "Steel Beam",
    productName: "I-Beam 8 inch",
    category: "Structural Steel",
    currentStock: 45,
    status: "In Stock",
    minimumStock: 20,
    unitPrice: 8500,
    inventoryValue: 382500,
    sku: "STBM-8IN-006"
  },
  {
    id: "7",
    name: "Steel Plate 10mm",
    productName: "MS Plate",
    category: "Sheets & Plates",
    currentStock: 1800,
    status: "In Stock",
    minimumStock: 400,
    unitPrice: 950,
    inventoryValue: 1710000,
    sku: "STPL-10MM-007"
  },
  {
    id: "8",
    name: "Rebar 16mm",
    productName: "TMT Rebar",
    category: "Construction Materials",
    currentStock: 0,
    status: "Out of Stock",
    minimumStock: 800,
    unitPrice: 780,
    inventoryValue: 0,
    sku: "REBR-16MM-008"
  }
];

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulate API call with dummy data
  const fetchInventoryData = async () => {
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      setInventoryItems(DUMMY_INVENTORY_DATA);
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

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
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary statistics
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.currentStock, 0);
  const lowStockItems = inventoryItems.filter(item => 
    item.status === "Low Stock" || item.currentStock <= item.minimumStock
  ).length;
  const outOfStockItems = inventoryItems.filter(item => 
    item.currentStock === 0
  ).length;
  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + item.inventoryValue, 0);

  const handleExport = () => {
    // Simulate export functionality
    console.log("Exporting stock report...");
    alert("Stock report exported successfully!");
  };

  const handleUpdateStock = () => {
    // Simulate stock update functionality
    console.log("Opening stock update modal...");
    alert("Stock update modal opened!");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <div className="text-lg text-gray-600">Loading inventory data...</div>
          </div>
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
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Stock Report
            </Button>
            <Button 
              className="bg-gradient-to-br from-red-800 via-red-600 to-red-900 hover:from-red-900 hover:via-red-700 hover:to-red-800"
              onClick={handleUpdateStock}
            >
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
                  <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold">₹{totalInventoryValue.toLocaleString('en-IN')}</p>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Details</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Inventory Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.currentStock.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Min: {item.minimumStock}</p>
                          </div>
                        </TableCell>
                        <TableCell>₹{item.unitPrice.toLocaleString('en-IN')}</TableCell>
                        <TableCell>₹{item.inventoryValue.toLocaleString('en-IN')}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No products found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;


import { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Download,
  Upload
} from 'lucide-react';

const Stocks = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const stockItems = [
    {
      id: 1,
      productCode: 'BC001',
      productName: 'Birlanu Portland Cement Grade 53',
      category: 'Cement',
      currentStock: 2450,
      minStock: 500,
      maxStock: 5000,
      unitPrice: 420,
      totalValue: 1029000,
      lastUpdated: '2025-01-08 10:30 AM',
      status: 'Good',
      unit: 'bags'
    },
    {
      id: 2,
      productCode: 'BS001',
      productName: 'Birlanu TMT Steel Bars Fe500D',
      category: 'Steel',
      currentStock: 850,
      minStock: 1000,
      maxStock: 3000,
      unitPrice: 65000,
      totalValue: 55250000,
      lastUpdated: '2025-01-08 09:15 AM',
      status: 'Low',
      unit: 'tons'
    },
    {
      id: 3,
      productCode: 'BT001',
      productName: 'Birlanu Ceramic Floor Tiles 600x600mm',
      category: 'Tiles',
      currentStock: 0,
      minStock: 500,
      maxStock: 2000,
      unitPrice: 45,
      totalValue: 0,
      lastUpdated: '2025-01-07 04:20 PM',
      status: 'Out of Stock',
      unit: 'pieces'
    },
    {
      id: 4,
      productCode: 'BB001',
      productName: 'Birlanu Red Clay Bricks Class A',
      category: 'Bricks',
      currentStock: 15000,
      minStock: 5000,
      maxStock: 25000,
      unitPrice: 8,
      totalValue: 120000,
      lastUpdated: '2025-01-08 11:45 AM',
      status: 'Good',
      unit: 'pieces'
    },
    {
      id: 5,
      productCode: 'BP001',
      productName: 'Birlanu Ready Mix Concrete M25 Grade',
      category: 'Concrete',
      currentStock: 150,
      minStock: 50,
      maxStock: 300,
      unitPrice: 4500,
      totalValue: 675000,
      lastUpdated: '2025-01-08 02:20 PM',
      status: 'Good',
      unit: 'cubic meters'
    },
    {
      id: 6,
      productCode: 'BA001',
      productName: 'Birlanu M-Sand (Manufactured Sand)',
      category: 'Aggregates',
      currentStock: 45,
      minStock: 50,
      maxStock: 200,
      unitPrice: 1200,
      totalValue: 54000,
      lastUpdated: '2025-01-08 01:15 PM',
      status: 'Low',
      unit: 'tons'
    },
    {
      id: 7,
      productCode: 'BW001',
      productName: 'Birlanu Exterior Wall Paint Weather Shield',
      category: 'Paints',
      currentStock: 280,
      minStock: 100,
      maxStock: 500,
      unitPrice: 180,
      totalValue: 50400,
      lastUpdated: '2025-01-07 03:45 PM',
      status: 'Good',
      unit: 'liters'
    },
    {
      id: 8,
      productCode: 'BF001',
      productName: 'Birlanu AAC Blocks 600x200x100mm',
      category: 'Blocks',
      currentStock: 85,
      minStock: 20,
      maxStock: 150,
      unitPrice: 3800,
      totalValue: 323000,
      lastUpdated: '2025-01-08 12:30 PM',
      status: 'Good',
      unit: 'cubic meters'
    }
  ];

  const filteredStocks = stockItems.filter(item =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Good': return 'bg-green-100 text-green-800';
      case 'Low': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const totalStockValue = stockItems.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = stockItems.filter(item => item.currentStock <= item.minStock).length;
  const outOfStockItems = stockItems.filter(item => item.currentStock === 0).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Construction Materials Stock</h1>
            <p className="text-gray-600">Monitor and manage your Birlanu construction materials inventory</p>
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
                  <p className="text-sm text-gray-600">Total Stock Value</p>
                  <p className="text-2xl font-bold">₹{(totalStockValue / 100000).toFixed(1)}L</p>
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
                  <p className="text-sm text-gray-600">Material Categories</p>
                  <p className="text-2xl font-bold">{stockItems.length}</p>
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
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
                </div>
                <div className="bg-red-100 p-2 rounded-lg">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stock Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Construction Materials Inventory</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search construction materials..."
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
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">{item.productCode}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.currentStock.toLocaleString()} {item.unit}</p>
                        <p className="text-xs text-gray-500">Min: {item.minStock.toLocaleString()} | Max: {item.maxStock.toLocaleString()}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              getStockPercentage(item.currentStock, item.maxStock) > 50 ? 'bg-green-500' :
                              getStockPercentage(item.currentStock, item.maxStock) > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${getStockPercentage(item.currentStock, item.maxStock)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">
                          {getStockPercentage(item.currentStock, item.maxStock)}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell>₹{item.totalValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{item.lastUpdated}</p>
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

export default Stocks;

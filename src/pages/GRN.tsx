
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
  Plus, 
  FileCheck, 
  Calendar,
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const GRN = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const grnRecords = [
    {
      id: 1,
      grnNumber: 'GRN-2025-001',
      poNumber: 'PO-2024-0156',
      supplier: 'Birlanu Head Office',
      invoiceNumber: 'INV-2025-0034',
      receivedDate: '2025-01-08',
      totalItems: 3,
      items: 'Cement (150 bags), Steel Bars (5 tons), Tiles (500 pieces)',
      totalQuantity: '155 units',
      totalValue: 845750,
      status: 'Completed',
      receivedBy: 'Raj Kumar'
    },
    {
      id: 2,
      grnNumber: 'GRN-2025-002',
      poNumber: 'PO-2024-0157',
      supplier: 'Birlanu Regional Depot',
      invoiceNumber: 'INV-2025-0035',
      receivedDate: '2025-01-07',
      totalItems: 2,
      items: 'Ready Mix Concrete (25 cubic meters), Bricks (2000 pieces)',
      totalQuantity: '2025 units',
      totalValue: 128500,
      status: 'Pending',
      receivedBy: 'Amit Sharma'
    },
    {
      id: 3,
      grnNumber: 'GRN-2025-003',
      poNumber: 'PO-2024-0158',
      supplier: 'Birlanu Manufacturing',
      invoiceNumber: 'INV-2025-0036',
      receivedDate: '2025-01-06',
      totalItems: 4,
      items: 'AAC Blocks (15 cubic meters), Paint (200 liters), M-Sand (10 tons), Aggregates (5 tons)',
      totalQuantity: '230 units',
      totalValue: 287200,
      status: 'Partially Received',
      receivedBy: 'Suresh Patel'
    }
  ];

  const pendingInvoices = [
    {
      id: 1,
      invoiceNumber: 'INV-2025-0037',
      poNumber: 'PO-2024-0159',
      supplier: 'Birlanu Head Office',
      invoiceDate: '2025-01-05',
      expectedDelivery: '2025-01-09',
      totalValue: 654200,
      items: 'Portland Cement (200 bags), TMT Steel (8 tons)',
      categories: 2
    },
    {
      id: 2,
      invoiceNumber: 'INV-2025-0038',
      poNumber: 'PO-2024-0160',
      supplier: 'Birlanu Regional Depot',
      invoiceDate: '2025-01-04',
      expectedDelivery: '2025-01-10',
      totalValue: 423800,
      items: 'Ceramic Tiles (1000 pieces), Wall Paint (150 liters), Bricks (3000 pieces)',
      categories: 3
    }
  ];

  const filteredGRN = grnRecords.filter(grn =>
    grn.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grn.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grn.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grn.items.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Partially Received': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Partially Received': return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Goods Receipt Note (GRN)</h1>
            <p className="text-gray-600">Track and manage received construction materials against invoices</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New GRN
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total GRNs</p>
                  <p className="text-2xl font-bold">{grnRecords.length}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileCheck className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {grnRecords.filter(g => g.status === 'Completed').length}
                  </p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {grnRecords.filter(g => g.status === 'Pending').length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month Value</p>
                  <p className="text-2xl font-bold">₹{(grnRecords.reduce((sum, grn) => sum + grn.totalValue, 0) / 100000).toFixed(1)}L</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Truck className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Pending Construction Material Invoices for GRN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingInvoices.map((invoice) => (
                <Card key={invoice.id} className="border-l-4 border-l-orange-400">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">{invoice.poNumber}</p>
                      </div>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Create GRN
                      </Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Supplier:</span>
                        <span>{invoice.supplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected:</span>
                        <span>{invoice.expectedDelivery}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-medium">₹{invoice.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Categories:</span>
                        <span>{invoice.categories}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-600">Items: {invoice.items}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GRN Records */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Construction Materials GRN Records</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search GRN records..."
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
                  <TableHead>GRN Details</TableHead>
                  <TableHead>Invoice & PO</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Materials Received</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Received By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGRN.map((grn) => (
                  <TableRow key={grn.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{grn.grnNumber}</p>
                        <p className="text-sm text-gray-500">{grn.totalItems} material types</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{grn.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">{grn.poNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>{grn.supplier}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{grn.totalQuantity}</p>
                        <p className="text-xs text-gray-500">{grn.items}</p>
                      </div>
                    </TableCell>
                    <TableCell>{grn.receivedDate}</TableCell>
                    <TableCell>₹{grn.totalValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(grn.status)} flex items-center gap-1`}>
                        {getStatusIcon(grn.status)}
                        {grn.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{grn.receivedBy}</TableCell>
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

export default GRN;

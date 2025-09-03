
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
  MapPin, 
  Phone, 
  Mail, 
  Plus,
  Eye,
  Edit,
  Star
} from 'lucide-react';

const Retailers = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const retailers = [
    {
      id: 1,
      name: 'Sharma General Store',
      owner: 'Raj Sharma',
      phone: '+91 98765 43210',
      email: 'raj.sharma@email.com',
      address: 'MG Road, Bangalore, Karnataka',
      status: 'Active',
      rating: 4.5,
      totalOrders: 145,
      lastOrder: '2025-01-05'
    },
    {
      id: 2,
      name: 'Patel Trading Co.',
      owner: 'Amit Patel',
      phone: '+91 87654 32109',
      email: 'amit.patel@email.com',
      address: 'Commercial Street, Mumbai, Maharashtra',
      status: 'Active',
      rating: 4.2,
      totalOrders: 89,
      lastOrder: '2025-01-04'
    },
    {
      id: 3,
      name: 'Kumar Enterprises',
      owner: 'Suresh Kumar',
      phone: '+91 76543 21098',
      email: 'suresh.kumar@email.com',
      address: 'Nehru Place, Delhi',
      status: 'Inactive',
      rating: 3.8,
      totalOrders: 67,
      lastOrder: '2024-12-20'
    }
  ];

  const filteredRetailers = retailers.filter(retailer =>
    retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    retailer.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Retailers</h1>
            <p className="text-gray-600">Manage your associated retail partners</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Retailer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Retailers</p>
                  <p className="text-2xl font-bold">156</p>
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
                  <p className="text-sm text-gray-600">Active Retailers</p>
                  <p className="text-2xl font-bold">142</p>
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
                  <p className="text-sm text-gray-600">This Month Orders</p>
                  <p className="text-2xl font-bold">1,234</p>
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
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold">4.3</p>
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
              <CardTitle>Retailer List</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search retailers..."
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
                  <TableHead>Retailer Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRetailers.map((retailer) => (
                  <TableRow key={retailer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{retailer.name}</p>
                        <p className="text-sm text-gray-500">{retailer.owner}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-2 text-gray-400" />
                          {retailer.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-2 text-gray-400" />
                          {retailer.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start">
                        <MapPin className="h-3 w-3 mt-1 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="text-sm">{retailer.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(retailer.status)}>
                        {retailer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-400" />
                          <span className="text-sm">{retailer.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{retailer.totalOrders} orders</p>
                        <p className="text-xs text-gray-500">Last: {retailer.lastOrder}</p>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Retailers;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  IndianRupee,
  Users,
  Target,
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const metrics = [
    {
      title: 'Monthly Sales',
      value: '₹24,56,800',
      change: '+15.2%',
      trend: 'up',
      icon: IndianRupee,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Orders Placed',
      value: '89',
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Order Pending Delivery',
      value: '8',
      change: '+1',
      trend: 'up',
      icon: Package,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Available Credit',
      value: '3,80,000',
      change: '+4.2%',
      trend: 'up',
      icon: Target,
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const recentOrders = [
    { id: 'ORD-001', date: '2025-01-08', amount: '₹1,54,500', status: 'Delivered', product: 'Cement & Steel' },
    { id: 'ORD-002', date: '2025-01-07', amount: '₹82,300', status: 'Processing', product: 'Tiles & Blocks' },
    { id: 'ORD-003', date: '2025-01-06', amount: '₹2,21,000', status: 'Shipped', product: 'Ready Mix Concrete' },
    { id: 'ORD-004', date: '2025-01-05', amount: '₹58,200', status: 'Pending', product: 'Bricks & Sand' },
  ];

  const topProducts = [
    { name: 'Birlanu Portland Cement Grade 53', sold: '450 bags', revenue: '₹1,89,000' },
    { name: 'Birlanu TMT Steel Bars Fe500D', sold: '15.2 tons', revenue: '₹9,88,000' },
    { name: 'Birlanu Ceramic Floor Tiles 600x600mm', sold: '2,450 pieces', revenue: '₹1,10,250' },
    { name: 'Birlanu Ready Mix Concrete M25', sold: '45 cubic meters', revenue: '₹2,02,500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome to Birlanu Distributor Portal</h1>
              <p className="text-blue-100">Manage your construction materials business with Birlanu's premium products</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/catalog')}
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                Browse Construction Materials
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${metric.color}`}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Construction Orders
                <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                      <p className="text-xs text-gray-500">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{order.amount}</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Hot Selling Products
                <Button variant="ghost" size="sm" onClick={() => navigate('/catalog')}>
                  View Catalog
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sold}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{product.revenue}</p>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-500">#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="h-20 flex flex-col space-y-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/catalog')}
              >
                <Package className="h-6 w-6" />
                <span>Browse Construction Materials</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => navigate('/cart')}
              >
                <ShoppingCart className="h-6 w-6" />
                <span>View Cart</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => navigate('/orders')}
              >
                <Calendar className="h-6 w-6" />
                <span>Order History</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

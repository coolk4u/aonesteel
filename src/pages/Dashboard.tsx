import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Package, ShoppingCart, IndianRupee, Users, Target, Award, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import brandambassador from './assets/Brand Ambessador.png';
const Dashboard = () => {
  const navigate = useNavigate();
  const metrics = [{
    title: 'Monthly Sales',
    value: '₹24,56,800',
    change: '+15.2%',
    trend: 'up',
    icon: IndianRupee,
    textColor: 'text-white'
  }, {
    title: 'Orders Placed',
    value: '89',
    change: '+12.5%',
    trend: 'up', 
    icon: ShoppingCart,
    textColor: 'text-white'
  }, {
    title: 'Order Pending Delivery',
    value: '8',
    change: '+1',
    trend: 'up',
    icon: Package,
    textColor: 'text-white'
  }, {
    title: 'Available Credit',
    value: '₹3,80,000',
    change: '+4.2%',
    trend: 'up',
    icon: Target,
    textColor: 'text-white'
  }];
  const recentOrders = [{
    id: 'ORD-001',
    date: '2025-01-08',
    amount: '₹1,54,500',
    status: 'Delivered',
    product: 'Cement & Steel'
  }, {
    id: 'ORD-002',
    date: '2025-01-07',
    amount: '₹82,300',
    status: 'Processing',
    product: 'Tiles & Blocks'
  }, {
    id: 'ORD-003',
    date: '2025-01-06',
    amount: '₹2,21,000',
    status: 'Shipped',
    product: 'Ready Mix Concrete'
  }, {
    id: 'ORD-004',
    date: '2025-01-05',
    amount: '₹58,200',
    status: 'Pending',
    product: 'Bricks & Sand'
  }];
  const topProducts = [{
    name: 'A-One Steel TMT Bars Fe550D - 12mm',
    sold: '15.2 tons',
    revenue: '₹9,88,000'
  }, {
    name: 'A-One Steel TMT Bars Fe500 - 16mm',
    sold: '18.5 tons',
    revenue: '₹11,25,000'
  }, {
    name: 'A-One Steel TMT Bars Fe415 - 8mm',
    sold: '8.7 tons',
    revenue: '₹4,56,000'
  }, {
    name: 'A-One Steel TMT Bars Fe550D - 20mm',
    sold: '12.3 tons',
    revenue: '₹8,75,000'
  }];
  return <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-red-800 via-red-600 to-red-900 p-1 text-white shadow-glow">
          {/* <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-3">Welcome to A-One Steel Portal</h1>
              <p className="text-purple-100 text-lg">Manage your steel business with A-One Steel Group's premium TMT products</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="secondary" onClick={() => navigate('/catalog')} className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
                Browse TMT Products
              </Button>
            </div>
          </div> */}
          <img src={brandambassador} alt="" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric, index) => 
            <Card key={index} className={`bg-gradient-to-br from-red-800 via-red-600 to-red-900 hover:shadow-soft transition-all duration-300 hover:scale-105 border-0`}>
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium mb-2 ${metric.textColor} opacity-90`}>{metric.title}</p>
                    <p className={`text-xl font-bold ${metric.textColor} mb-3`}>{metric.value}</p>
                    <div className="flex items-center">
                      {metric.trend === 'up' ? <ArrowUpRight className={`h-4 w-4 ${metric.textColor} mr-1 opacity-80`} /> : <ArrowDownRight className={`h-4 w-4 ${metric.textColor} mr-1 opacity-80`} />}
                      <span className={`text-sm font-medium ${metric.textColor} opacity-90`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-white/20 backdrop-blur-sm`}>
                    <metric.icon className={`h-8 w-8 ${metric.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card className="shadow-soft border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-foreground">
                Recent Steel Orders
                <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map(order => 
                  <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
                      <p className="text-xs text-muted-foreground/80">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{order.amount}</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="shadow-soft border-0">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-foreground">
                Top Selling TMT Products
                <Button variant="ghost" size="sm" onClick={() => navigate('/catalog')} className="text-primary hover:text-primary/80">
                  View Catalog
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product, index) => 
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground mb-1">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sold}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{product.revenue}</p>
                      <div className="flex items-center justify-end mt-1">
                        <Award className="h-4 w-4 text-primary mr-1" />
                        <span className="text-sm text-muted-foreground">#{index + 1}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className=" shadow-soft border-0">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-24 flex flex-col space-y-3 bg-gradient-to-br from-red-800 via-red-600 to-red-900 text-white hover:opacity-90 transition-opacity rounded-xl shadow-soft" onClick={() => navigate('/catalog')}>
                <Package className=" h-7 w-7" />
                <span className="font-medium">Browse TMT Products</span>
              </Button>
              <Button variant="outline" className="bg-gradient-to-br from-red-800 via-red-600 to-red-900 h-24 flex flex-col space-y-3 border-2 border-primary/20 hover:bg-primary/5 rounded-xl" onClick={() => navigate('/cart')}>
                <ShoppingCart className="h-7 w-7 text-primary text-white" />
                <span className="font-medium text-white">View Cart</span>
              </Button>
              <Button variant="outline" className="bg-gradient-to-br from-red-800 via-red-600 to-red-900 h-24 flex flex-col space-y-3 border-2 border-primary/20 hover:bg-primary/5 rounded-xl" onClick={() => navigate('/orders')}>
                <Calendar className="h-7 w-7 text-primary text-white" />
                <span className="font-medium text-white">Order History</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>;
};
export default Dashboard;
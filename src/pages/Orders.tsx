// orders.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Package, Truck, CheckCircle, Clock, IndianRupee, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  unit: string;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Pending';
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const authResponse = await axios.post(
          'https://pde3-dev-ed.develop.my.salesforce.com/services/oauth2/token',
          new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: '3MVG97z4K_iuCemhaHjeuAp6A5jpAuMB31Trve1nd0TZAeH7onoyc.LAATp2pnK2Ag3kaMYorR4Np7E7XgMa9',
            client_secret: '49C874D60D67C1A6BF3B31213B2F924747A0D27CBEFD2ACEDE0751E20FFFEAA7',
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const accessToken = authResponse.data.access_token;

        const query = `
          SELECT OrderNumber, Status, EffectiveDate, AccountId,
          (SELECT Quantity, UnitPrice, TotalPrice,
                  PricebookEntry.Product2.Name,
                  PricebookEntry.Product2.ProductCode,
                  PricebookEntry.Product2.Description
           FROM OrderItems)
          FROM Order
          ORDER BY CreatedDate DESC
          LIMIT 200
        `.replace(/\s+/g, '+');

        const queryUrl = `https://pde3-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${query}`;
        const response = await axios.get(queryUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const fetchedOrders = response.data.records.map((order: any) => {
          const items = (order.OrderItems?.records || []).map((item: any) => ({
            name: item.PricebookEntry?.Product2?.Name || 'Unknown',
            quantity: item.Quantity,
            price: item.UnitPrice,
            unit: 'units',
          }));

          const subtotal = items.reduce((sum: number, item: OrderItem) => sum + item.quantity * item.price, 0);
          const tax = Math.round(subtotal * 0.18);
          const total = subtotal + tax;

          return {
            id: order.OrderNumber,
            date: order.EffectiveDate,
            items,
            subtotal,
            tax,
            total,
            status: order.Status || 'Pending',
          };
        });

        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing': return <Clock className="h-4 w-4" />;
      case 'Shipped': return <Truck className="h-4 w-4" />;
      case 'Delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <FileText className="h-4 w-4 mr-1" />
              {orders.length} Total Orders
            </Badge>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{order.id}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {order.date}
                          </div>
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            {order.items.length} items
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(order.status)} mb-2`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                      <div className="text-lg font-bold text-gray-900">₹{order.total}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} {item.unit} × ₹{item.price}
                          </p>
                        </div>
                        <div className="font-medium text-gray-900">
                          ₹{item.quantity * item.price}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Subtotal</p>
                        <p className="font-medium">₹{order.subtotal}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">GST (18%)</p>
                        <p className="font-medium">₹{order.tax}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Total</p>
                        <p className="font-bold text-lg">₹{order.total}</p>
                      </div>
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;

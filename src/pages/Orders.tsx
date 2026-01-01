// orders.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Package,
  Truck,
  CheckCircle,
  Clock,
  IndianRupee,
  Calendar,
} from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";

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
  status: "Processing" | "Shipped" | "Delivered" | "Pending";
}

// Dummy data in JSON format
const DUMMY_ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-03-15",
    items: [
      { name: "Stainless Steel Sheet", quantity: 5, price: 1250, unit: "pieces" },
      { name: "Galvanized Iron Pipe", quantity: 10, price: 850, unit: "meters" },
      { name: "Aluminum Rod", quantity: 8, price: 950, unit: "pieces" }
    ],
    subtotal: 22550,
    tax: 4059,
    total: 26609,
    status: "Delivered"
  },
  {
    id: "ORD-2024-002",
    date: "2024-03-14",
    items: [
      { name: "Copper Wire", quantity: 15, price: 675, unit: "meters" },
      { name: "Steel Beam", quantity: 3, price: 3250, unit: "pieces" }
    ],
    subtotal: 15875,
    tax: 2857.5,
    total: 18732.5,
    status: "Shipped"
  },
  {
    id: "ORD-2024-003",
    date: "2024-03-13",
    items: [
      { name: "Brass Fittings", quantity: 25, price: 120, unit: "pieces" },
      { name: "Steel Plate", quantity: 6, price: 1850, unit: "pieces" },
      { name: "Zinc Coating", quantity: 2, price: 4500, unit: "liters" }
    ],
    subtotal: 20100,
    tax: 3618,
    total: 23718,
    status: "Processing"
  },
  {
    id: "ORD-2024-004",
    date: "2024-03-12",
    items: [
      { name: "Carbon Steel Bar", quantity: 12, price: 750, unit: "pieces" },
      { name: "Stainless Steel Bolts", quantity: 50, price: 45, unit: "pieces" }
    ],
    subtotal: 11250,
    tax: 2025,
    total: 13275,
    status: "Pending"
  },
  {
    id: "ORD-2024-005",
    date: "2024-03-11",
    items: [
      { name: "Titanium Alloy Sheet", quantity: 4, price: 5200, unit: "pieces" },
      { name: "Nickel Wire", quantity: 8, price: 1875, unit: "meters" },
      { name: "Steel Mesh", quantity: 3, price: 3250, unit: "rolls" }
    ],
    subtotal: 39750,
    tax: 7155,
    total: 46905,
    status: "Delivered"
  }
];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Simulate API call with timeout
    const fetchOrders = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setOrders(DUMMY_ORDERS);
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing":
        return <Clock className="h-4 w-4" />;
      case "Shipped":
        return <Truck className="h-4 w-4" />;
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600">
              Start shopping to see your orders here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-shadow"
              >
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
                      <div className="text-lg font-bold text-gray-900">
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} {item.unit} × ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <div className="font-medium text-gray-900">
                          ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Subtotal</p>
                        <p className="font-medium">₹{order.subtotal.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">GST (18%)</p>
                        <p className="font-medium">₹{order.tax.toLocaleString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Total</p>
                        <p className="font-bold text-lg">₹{order.total.toLocaleString('en-IN')}</p>
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

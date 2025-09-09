import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Package,
  IndianRupee,
  Percent,
  CheckCircle,
  Heart,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import CartTemplate from "@/components/CartTemplate/CartTemplate";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface CartItem {
  id: string;
  name: string;
  price: number;
  mrp: number;
  quantity: number;
  unit: string;
  minOrderQty: number;
  schemes: string[];
  image: string;
  description: string;
}

const CLIENT_ID =
  "3MVG9XDDwp5wgbs0GBXn.nVBDZ.vhpls3uA9Kt.F0F5kdFtHSseF._pbUChPd76LvA0AdGGrLu7SfDmwhvCYl";
const CLIENT_SECRET =
  "D63B980DDDE3C45170D6F9AE12215FCB6A7490F97E383E579BE8DEE427A0D891";
const TOKEN_URL =
  "https://aonesteelgroup-dev-ed.develop.my.salesforce.com/services/oauth2/token";
const ORDER_API_URL =
  "https://aonesteelgroup-dev-ed.develop.my.salesforce.com/services/apexrest/CreateOrderService";

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    const item = cart.find((item) => item.id === id);
    if (!item) return;

    if (newQuantity < item.minOrderQty) {
      toast({
        title: "Minimum Order Quantity",
        description: `Minimum order quantity is ${item.minOrderQty} ${item.unit}`,
        variant: "destructive",
      });
      return;
    }
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    updateCart(newCart);
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    updateCart(newCart);
    toast({ title: "Item Removed", description: "Product removed from cart" });
  };

  const clearCart = () => {
    updateCart([]);
    toast({
      title: "Cart Cleared",
      description: "All items removed from cart",
    });
  };

  const addTemplateToCart = (templateItems: CartItem[]) => {
    const newCart = [...cart];
    templateItems.forEach((templateItem) => {
      const existingIndex = newCart.findIndex(
        (item) => item.id === templateItem.id
      );
      if (existingIndex >= 0) {
        newCart[existingIndex].quantity += templateItem.quantity;
      } else {
        newCart.push({ ...templateItem });
      }
    });
    updateCart(newCart);
  };

  const calculateSubtotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const calculateMRPTotal = () =>
    cart.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const calculateSavings = () => calculateMRPTotal() - calculateSubtotal();
  const calculateTax = () => Math.round(calculateSubtotal() * 0.18);
  const calculateTotal = () => calculateSubtotal() + calculateTax();

  const fetchAccessToken = async () => {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);

    try {
      const response = await axios.post(TOKEN_URL, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw new Error("Failed to authenticate with Salesforce");
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before placing order",
        variant: "destructive",
      });
      return;
    }

    setIsPlacingOrder(true);

    try {
      const token = await fetchAccessToken();

      // Prepare order payload
      const payload = {
        accountId: "0015j00000R5v2FAAR", // Replace with actual account ID
        orderItems: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      };

      console.log("Order payload:", JSON.stringify(payload, null, 2));

      // Create order
      const response = await axios.post(ORDER_API_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      });

      console.log("Order response:", response.data);

      if (response.data.success) {
        // Clear cart and show success message
        clearCart();
        toast({
          title: "Order Placed Successfully!",
          description: `Order Number: ${response.data.orderNumber}, Contract Number: ${response.data.contractNumber}`,
          variant: "default",
        });
        navigate("/orders");
      } else {
        toast({
          title: "Order Failed",
          description: response.data.message || "Failed to create order",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error placing order:", error);

      let errorMessage = "Failed to create order. Please try again later.";

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        if (error.response.status === 400) {
          errorMessage = "Bad request. Please check your order data.";
        } else if (error.response.status === 401) {
          errorMessage =
            "Authentication failed. Please check your credentials.";
        } else if (error.response.status === 404) {
          errorMessage =
            "Order service not found. Please check the endpoint URL.";
        } else if (
          error.response.data &&
          error.response.data[0] &&
          error.response.data[0].message
        ) {
          errorMessage = error.response.data[0].message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }

      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const renderCartContent = () => {
    if (cart.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Start shopping to add items to your cart
          </p>
          <Button
            onClick={() => navigate("/catalog")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Browse Products
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <p className="text-gray-600">{cart.length} items in your cart</p>
          </div>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/150";
                          e.currentTarget.className =
                            "w-full h-full object-contain rounded-lg p-2";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {item.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.mrp}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 text-xs"
                        >
                          {Math.round(
                            ((item.mrp - item.price) / item.mrp) * 100
                          )}
                          % OFF
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        {item.schemes?.slice(0, 2).map((scheme, index) => (
                          <div
                            key={index}
                            className="flex items-center text-xs text-orange-600"
                          >
                            <Percent className="h-3 w-3 mr-1" />
                            {scheme}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:space-x-3">
                      <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ₹{item.price * item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>You Save</span>
                    <span>-₹{calculateSavings()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (18%)</span>
                    <span>₹{calculateTax()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={placeOrder}
                  className="w-full bg-gradient-to-br from-red-800 via-red-600 to-red-900"
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Place Order
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Offers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center text-orange-700">
                    <Percent className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Festival Special: Extra 5% off on orders above ₹5000
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center text-blue-700">
                    <IndianRupee className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Free delivery on orders above ₹2000
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Cart & Templates</h1>
        </div>
        <Tabs defaultValue="cart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="cart"
              className="flex items-center data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-800 data-[state=active]:via-red-600 data-[state=active]:to-red-900 data-[state=active]:text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Current Cart
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="flex items-center data-[state=active]:bg-gradient-to-br data-[state=active]:from-red-800 data-[state=active]:via-red-600 data-[state=active]:to-red-900 data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Saved Templates
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cart" className="mt-6">
            {renderCartContent()}
          </TabsContent>
          <TabsContent value="templates" className="mt-6">
            <CartTemplate currentCart={cart} onAddToCart={addTemplateToCart} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Cart;

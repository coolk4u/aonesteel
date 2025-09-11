import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingCart,
  Star,
  Package,
  Percent,
  Gift,
  Zap,
  Clock,
} from "lucide-react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  image: string;
  rating: number;
  inStock: boolean;
  description: string;
  schemes: string[];
  minOrderQty: number;
  unit: string;
  bulkDiscount?: number;
  limitedTimeOffer?: boolean;
  limitedTimeDiscount?: number;
}

const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<any[]>([]);

  const fetchProducts = async () => {
    const tokenUrl =
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
      const tokenResponse = await axios.post(tokenUrl, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const accessToken = tokenResponse.data.access_token;

      const query = `
                SELECT Id, Name, ProductCode, Family, IsActive, Prod_Img_Url__c, Description,
        (SELECT UnitPrice FROM PricebookEntries WHERE Pricebook2.IsStandard = true LIMIT 1)
        FROM Product2
        WHERE Family = 'Steel'
        ORDER BY CreatedDate DESC
        LIMIT 200
      `.replace(/\s+/g, "+");

      const queryUrl = `https://aonesteelgroup-dev-ed.develop.my.salesforce.com/services/data/v62.0/query?q=${query}`;

      const response = await axios.get(queryUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const salesforceProducts = response.data.records.map((record: any, index: number) => {
        // Assign fixed discounts based on product index to ensure consistent distribution
        let bulkDiscount: number;
        let hasLimitedOffer = false;
        let limitedTimeDiscount = 0;
        
        // Distribute products evenly across discount categories
        if (index % 3 === 0) {
          bulkDiscount = 20;
          hasLimitedOffer = true;
          limitedTimeDiscount = 15; // Fixed 15% for 20% discount products
        } else if (index % 3 === 1) {
          bulkDiscount = 10;
          hasLimitedOffer = index % 2 === 0; // 50% chance for limited offer
          limitedTimeDiscount = hasLimitedOffer ? 10 : 0; // Fixed 10% when available
        } else {
          bulkDiscount = 5;
          hasLimitedOffer = index % 4 === 0; // 25% chance for limited offer
          limitedTimeDiscount = hasLimitedOffer ? 5 : 0; // Fixed 5% when available
        }
        
        return {
          id: record.Id,
          name: record.Name,
          category: record.Family || "General",
          price: record.PricebookEntries?.records?.[0]?.UnitPrice || 0,
          mrp: (record.PricebookEntries?.[0]?.UnitPrice || 0) * 1.1, // assume 10% markup
          image: record.Prod_Img_Url__c || "https://via.placeholder.com/150",
          rating: Math.random() * 2 + 3, // Random rating between 3 and 5
          inStock: record.IsActive,
          description: record.Description,
          schemes: [
            "Bulk Discount Available",
            hasLimitedOffer ? "Limited Time Offer" : ""
          ].filter(Boolean),
          minOrderQty: 10,
          unit: "units",
          bulkDiscount: bulkDiscount,
          limitedTimeOffer: hasLimitedOffer,
          limitedTimeDiscount: limitedTimeDiscount
        };
      });

      setProducts(salesforceProducts);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group products by bulk discount with fixed counts
  const productsByBulkDiscount = {
    discount20: filteredProducts.filter(product => product.bulkDiscount === 20).slice(0, 6), // Fixed 6 products
    discount10: filteredProducts.filter(product => product.bulkDiscount === 10).slice(0, 6), // Fixed 6 products
    discount5: filteredProducts.filter(product => product.bulkDiscount === 5).slice(0, 6),   // Fixed 6 products
    noDiscount: filteredProducts.filter(product => !product.bulkDiscount)
  };

  const addToCart = (
    product: Product,
    quantity: number = product.minOrderQty
  ) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    toast({
      title: "Added to Cart",
      description: `${product.name} (${quantity} ${product.unit}) added to cart`,
    });
  };

  const getDiscountPercentage = (price: number, mrp: number) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  // Handle image loading errors
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "https://via.placeholder.com/150";
  };

  // Render product section based on discount
  const renderProductSection = (title: string, products: Product[], discountPercent?: number) => {
    if (products.length === 0) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
            {discountPercent && (
              <span className="ml-2 text-red-600">({discountPercent}% Bulk Discount)</span>
            )}
          </h2>
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            <Package className="h-4 w-4 mr-1" />
            {products.length} Products
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-shadow flex flex-col h-full relative"
            >
              {/* Limited Time Offer Ribbon */}
              {product.limitedTimeOffer && (
                <div className="absolute top-4 -left-2 bg-green-500 text-white px-3 py-1 text-xs font-bold rotate-[ -20deg] z-10 shadow-md">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    In Scheme
                  </div>
                  <div className="absolute -bottom-1 left-0 w-0 h-0 border-t-4 border-t-amber-700 border-l-4 border-l-transparent"></div>
                </div>
              )}
              
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={handleImageError}
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <CardContent className="p-4 flex flex-col flex-grow">
                <div className="space-y-3 flex-grow">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.rating.toFixed(1)})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{product.mrp}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Min: {product.minOrderQty} {product.unit}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {/* Bulk Discount Badge */}
                    <div className="flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                      <Percent className="h-3 w-3 mr-1" />
                      {product.bulkDiscount}% Bulk Discount Available
                    </div>
                    
                    {/* Limited Time Offer Badge */}
                    {product.limitedTimeOffer && product.limitedTimeDiscount && (
                      <div className="flex items-center text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                        <Clock className="h-3 w-3 mr-1" />
                        Limited Time Offer - Extra {product.limitedTimeDiscount}% Off
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <Button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="w-full bg-gradient-to-br from-red-800 via-red-600 to-red-900"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add {product.minOrderQty} {product.unit} to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              A-One Steel Materials Catalog
            </h1>
            <p className="text-gray-600">
              Browse and order from our extensive A-One Steel TMT and
              construction materials range
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Package className="h-4 w-4 mr-1" />
              {filteredProducts.length} Products
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <ShoppingCart className="h-4 w-4 mr-1" />
              {cart.reduce((sum, item) => sum + item.quantity, 0)} Items in Cart
            </Badge>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search A-One Steel materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`whitespace-nowrap ${
                    category === "All"
                      ? "bg-gradient-to-br from-red-800 via-red-600 to-red-900 text-white"
                      : ""
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-800 via-red-600 to-red-900 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">A-One Steel Special Offers!</h3>
                <p className="text-sm text-orange-100">
                  TMT Bar schemes • Bulk discounts • Limited time offers • Free transport • Quality
                  guarantee
                </p>
              </div>
            </div>
            <Zap className="h-8 w-8 text-yellow-300" />
          </div>
        </div>

        {/* Render products in sections by discount */}
        {renderProductSection("Premium Offers", productsByBulkDiscount.discount20, 20)}
        {renderProductSection("Special Discounts", productsByBulkDiscount.discount10, 10)}
        {renderProductSection("Value Deals", productsByBulkDiscount.discount5, 5)}
        {renderProductSection("All Products", productsByBulkDiscount.noDiscount)}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductCatalog;
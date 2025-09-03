import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  Package,
  Percent,
  Gift,
  Zap,
} from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

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
}

const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<any[]>([]);

  const fetchProducts = async () => {
    const tokenUrl = 'https://pde3-dev-ed.develop.my.salesforce.com/services/oauth2/token';
    const clientId = '3MVG97z4K_iuCemhaHjeuAp6A5jpAuMB31Trve1nd0TZAeH7onoyc.LAATp2pnK2Ag3kaMYorR4Np7E7XgMa9';
    const clientSecret = '49C874D60D67C1A6BF3B31213B2F924747A0D27CBEFD2ACEDE0751E20FFFEAA7';

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    try {
      const tokenResponse = await axios.post(tokenUrl, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const accessToken = tokenResponse.data.access_token;

      const query = `
        SELECT Id, Name, ProductCode, Family, IsActive, Product_Image_URL__c,
        (SELECT UnitPrice FROM PricebookEntries WHERE Pricebook2.IsStandard = true LIMIT 1)
        FROM Product2
        WHERE Family = 'Pipes'
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

      const salesforceProducts = response.data.records.map((record: any) => ({
        id: record.Id,
        name: record.Name,
        category: record.Family || 'General',
        price: record.PricebookEntries?.records?.[0]?.UnitPrice || 0,
        mrp: (record.PricebookEntries?.[0]?.UnitPrice || 0) * 1.1, // assume 10% markup
        image: record.Product_Image_URL__c || 'https://via.placeholder.com/150',
        rating: Math.random() * 2 + 3, // Random rating between 3 and 5
        inStock: record.IsActive,
        description: `High quality ${record.Family} - ${record.ProductCode}`,
        schemes: ['Bulk Discount Available', 'Limited Time Offer'],
        minOrderQty: 10,
        unit: 'units',
      }));

      setProducts(salesforceProducts);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product, quantity: number = product.minOrderQty) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity }];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));

    toast({
      title: "Added to Cart",
      description: `${product.name} (${quantity} ${product.unit}) added to cart`,
    });
  };

  const getDiscountPercentage = (price: number, mrp: number) => {
    return Math.round(((mrp - price) / mrp) * 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Construction Materials Catalog</h1>
            <p className="text-gray-600">Browse and order from our extensive construction materials range</p>
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
                placeholder="Search construction materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Construction Season Special Offers!</h3>
                <p className="text-sm text-orange-100">Contractor schemes • Bulk discounts • Free transport • Quality guarantee</p>
              </div>
            </div>
            <Zap className="h-8 w-8 text-yellow-300" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
                {/* <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    {getDiscountPercentage(product.price, product.mrp)}% OFF
                  </Badge>
                </div> */}
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.rating.toFixed(1)})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">₹{product.mrp}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Min: {product.minOrderQty} {product.unit}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    {product.schemes.map((scheme, index) => (
                      <div key={index} className="flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                        <Percent className="h-3 w-3 mr-1" />
                        {scheme}
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="w-full"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add {product.minOrderQty} {product.unit} to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductCatalog;

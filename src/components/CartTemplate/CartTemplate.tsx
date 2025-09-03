
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  ShoppingCart, 
  Trash2, 
  Package,
  Plus,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  mrp: number;
  quantity: number;
  unit: string;
  minOrderQty: number;
  schemes: string[];
}

interface CartTemplate {
  id: string;
  name: string;
  items: CartItem[];
  createdAt: string;
  totalItems: number;
  totalValue: number;
}

interface CartTemplateProps {
  currentCart: CartItem[];
  onAddToCart: (items: CartItem[]) => void;
}

const CartTemplate = ({ currentCart, onAddToCart }: CartTemplateProps) => {
  const [templates, setTemplates] = useState<CartTemplate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const savedTemplates = localStorage.getItem('cartTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  const updateTemplates = (newTemplates: CartTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem('cartTemplates', JSON.stringify(newTemplates));
  };

  const saveCurrentCart = () => {
    if (currentCart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before saving as template",
        variant: "destructive"
      });
      return;
    }

    if (!newTemplateName.trim()) {
      toast({
        title: "Template Name Required",
        description: "Please enter a name for your cart template",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: CartTemplate = {
      id: 'template-' + Date.now(),
      name: newTemplateName.trim(),
      items: [...currentCart],
      createdAt: new Date().toISOString(),
      totalItems: currentCart.reduce((sum, item) => sum + item.quantity, 0),
      totalValue: currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    const newTemplates = [...templates, newTemplate];
    updateTemplates(newTemplates);
    
    setNewTemplateName('');
    setIsCreating(false);
    
    toast({
      title: "Template Saved",
      description: `Cart template "${newTemplate.name}" has been saved successfully`,
    });
  };

  const deleteTemplate = (templateId: string) => {
    const newTemplates = templates.filter(template => template.id !== templateId);
    updateTemplates(newTemplates);
    
    toast({
      title: "Template Deleted",
      description: "Cart template has been deleted",
    });
  };

  const addTemplateToCart = (template: CartTemplate) => {
    onAddToCart(template.items);
    
    toast({
      title: "Items Added to Cart",
      description: `${template.totalItems} items from "${template.name}" added to your cart`,
    });
  };

  const startEditing = (template: CartTemplate) => {
    setEditingId(template.id);
    setEditingName(template.name);
  };

  const saveEdit = (templateId: string) => {
    if (!editingName.trim()) {
      toast({
        title: "Name Required",
        description: "Template name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newTemplates = templates.map(template =>
      template.id === templateId 
        ? { ...template, name: editingName.trim() }
        : template
    );
    
    updateTemplates(newTemplates);
    setEditingId(null);
    setEditingName('');
    
    toast({
      title: "Template Updated",
      description: "Template name has been updated",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="space-y-6">
      {/* Save Current Cart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Save className="h-5 w-5 mr-2" />
            Save Current Cart as Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentCart.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{currentCart.length} items in current cart</span>
                <span>Total: ₹{currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</span>
              </div>
              
              {!isCreating ? (
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Save as Template
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter template name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={saveCurrentCart} size="sm">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreating(false);
                      setNewTemplateName('');
                    }}
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Add items to your cart to save as a template
            </p>
          )}
        </CardContent>
      </Card>

      {/* Saved Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Cart Templates ({templates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No saved templates yet. Save your first cart template above.
            </p>
          ) : (
            <div className="space-y-4">
              {templates.map(template => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      {editingId === template.id ? (
                        <div className="flex gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => saveEdit(template.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={cancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{template.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(template)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{template.totalItems} items</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>₹{template.totalValue}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">Items:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {template.items.slice(0, 4).map(item => (
                        <div key={item.id} className="text-xs bg-gray-50 p-2 rounded">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500 ml-2">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                      ))}
                      {template.items.length > 4 && (
                        <div className="text-xs bg-gray-50 p-2 rounded text-center text-gray-500">
                          +{template.items.length - 4} more items
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => addTemplateToCart(template)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add All to Cart
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CartTemplate;

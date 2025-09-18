import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Building2, Lock, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import logo from './assets/LOGO.png';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - accept any credentials
    if (credentials.username && credentials.password) {
      localStorage.setItem('distributorAuth', 'true');
      localStorage.setItem('distributorName', credentials.username);
      toast({
        title: "Login Successful",
        description: "Welcome to A-One Distributor Portal",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter both username and password",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-600 to-red-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div>
                <img src= {logo} alt="" className='h-16'/>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">A-One Steel & Alloys</CardTitle>
            <p className="text-gray-600 mt-2">Distributor Management System</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Distributor ID / Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your distributor ID"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="pl-10 h-12"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold">
                Login to Portal
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Demo credentials: Any username/password combination</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
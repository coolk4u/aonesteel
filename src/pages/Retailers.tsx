import { useEffect, useState } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Plus,
  Eye,
  Edit,
  Star,
} from "lucide-react";

interface ProjectSiteRecord {
  Id: string;
  Name: string;
  Location__Street__s?: string;
  Location__City__s?: string;
  Location__CountryCode__s?: string;
  Location__PostalCode__s?: string;
  Start_Date__c?: string;
  Is_Existing_Customer__c?: boolean;
  Status__c?: string;
  Builder_Account__r?: {
    Name: string;
  };
  Field_Visits__r?: {
    records: Array<{
      Id: string;
      Field_Officer__c: string;
      Check_In__c: string;
      Check_Out__c: string;
    }>;
  };
}

// Dummy data in JSON format
const DUMMY_PROJECT_SITES: ProjectSiteRecord[] = [
  {
    Id: "1",
    Name: "Downtown Office Tower",
    Location__Street__s: "123 Main Street",
    Location__City__s: "New York",
    Location__CountryCode__s: "US",
    Location__PostalCode__s: "10001",
    Start_Date__c: "2024-01-15",
    Is_Existing_Customer__c: true,
    Status__c: "Active",
    Builder_Account__r: {
      Name: "GR Trading Company"
    },
    Field_Visits__r: {
      records: [
        {
          Id: "visit1",
          Field_Officer__c: "John Smith",
          Check_In__c: "2024-03-15T09:00:00Z",
          Check_Out__c: "2024-03-15T17:00:00Z"
        },
        {
          Id: "visit2",
          Field_Officer__c: "Sarah Johnson",
          Check_In__c: "2024-03-10T10:30:00Z",
          Check_Out__c: "2024-03-10T15:45:00Z"
        }
      ]
    }
  },
  {
    Id: "2",
    Name: "Riverside Residential Complex",
    Location__Street__s: "456 River Road",
    Location__City__s: "Chicago",
    Location__CountryCode__s: "US",
    Location__PostalCode__s: "60601",
    Start_Date__c: "2024-02-20",
    Is_Existing_Customer__c: false,
    Status__c: "Active",
    Builder_Account__r: {
      Name: "BuildRight Construction"
    },
    Field_Visits__r: {
      records: [
        {
          Id: "visit3",
          Field_Officer__c: "Mike Wilson",
          Check_In__c: "2024-03-12T08:45:00Z",
          Check_Out__c: "2024-03-12T16:30:00Z"
        }
      ]
    }
  },
  {
    Id: "3",
    Name: "Tech Park Development",
    Location__Street__s: "789 Innovation Drive",
    Location__City__s: "San Francisco",
    Location__CountryCode__s: "US",
    Location__PostalCode__s: "94107",
    Start_Date__c: "2023-11-10",
    Is_Existing_Customer__c: true,
    Status__c: "Completed",
    Builder_Account__r: {
      Name: "GR Trading Company"
    },
    Field_Visits__r: {
      records: [
        {
          Id: "visit4",
          Field_Officer__c: "Emily Chen",
          Check_In__c: "2024-03-05T09:15:00Z",
          Check_Out__c: "2024-03-05T14:20:00Z"
        },
        {
          Id: "visit5",
          Field_Officer__c: "Robert Kim",
          Check_In__c: "2024-02-28T10:00:00Z",
          Check_Out__c: "2024-02-28T17:30:00Z"
        },
        {
          Id: "visit6",
          Field_Officer__c: "Lisa Wang",
          Check_In__c: "2024-02-15T08:30:00Z",
          Check_Out__c: "2024-02-15T16:00:00Z"
        }
      ]
    }
  },
  {
    Id: "4",
    Name: "Green Valley Mall",
    Location__Street__s: "101 Shopping Avenue",
    Location__City__s: "Miami",
    Location__CountryCode__s: "US",
    Location__PostalCode__s: "33101",
    Start_Date__c: "2024-03-01",
    Is_Existing_Customer__c: false,
    Status__c: "Planning",
    Builder_Account__r: {
      Name: "Urban Developers Inc"
    },
    Field_Visits__r: {
      records: []
    }
  },
  {
    Id: "5",
    Name: "Healthcare Center Expansion",
    Location__Street__s: "555 Health Lane",
    Location__City__s: "Boston",
    Location__CountryCode__s: "US",
    Location__PostalCode__s: "02108",
    Start_Date__c: "2024-01-30",
    Is_Existing_Customer__c: true,
    Status__c: "Active",
    Builder_Account__r: {
      Name: "GR Trading Company"
    },
    Field_Visits__r: {
      records: [
        {
          Id: "visit7",
          Field_Officer__c: "David Miller",
          Check_In__c: "2024-03-14T09:30:00Z",
          Check_Out__c: "2024-03-14T17:15:00Z"
        }
      ]
    }
  }
];

const Visit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [projectSites, setProjectSites] = useState<ProjectSiteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate data fetching with timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setProjectSites(DUMMY_PROJECT_SITES);
      setLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

  const filteredSites = projectSites.filter(
    (site) =>
      site.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (site.Builder_Account__r?.Name &&
        site.Builder_Account__r.Name.toLowerCase().includes(
          searchTerm.toLowerCase()
        ))
  );

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch(status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatAddress = (site: ProjectSiteRecord) => {
    const parts = [
      site.Location__Street__s,
      site.Location__City__s,
      site.Location__PostalCode__s,
      site.Location__CountryCode__s,
    ].filter((part) => part);

    return parts.join(", ") || "Address not available";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
          <p className="ml-3">Loading project sites...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Sites</h1>
            <p className="text-gray-600">
              Manage your project sites and field visits
            </p>
          </div>
          <Button className="bg-gradient-to-br from-red-800 via-red-600 to-red-900 hover:from-red-900 hover:via-red-700 hover:to-red-800">
            <Plus className="h-4 w-4 mr-2" />
            Add New Site
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sites</p>
                  <p className="text-2xl font-bold">{projectSites.length}</p>
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
                  <p className="text-sm text-gray-600">Active Sites</p>
                  <p className="text-2xl font-bold">
                    {
                      projectSites.filter((site) => site.Status__c === "Active")
                        .length
                    }
                  </p>
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
                  <p className="text-sm text-gray-600">Existing Customers</p>
                  <p className="text-2xl font-bold">
                    {
                      projectSites.filter(
                        (site) => site.Is_Existing_Customer__c
                      ).length
                    }
                  </p>
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
                  <p className="text-sm text-gray-600">Field Visits</p>
                  <p className="text-2xl font-bold">
                    {projectSites.reduce(
                      (total, site) =>
                        total + (site.Field_Visits__r?.records?.length || 0),
                      0
                    )}
                  </p>
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
              <CardTitle>Site List</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sites..."
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
                  <TableHead>Site Details</TableHead>
                  <TableHead>Dealer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Field Visits</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.length > 0 ? (
                  filteredSites.map((site) => (
                    <TableRow key={site.Id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{site.Name}</p>
                          <p className="text-sm text-gray-500">
                            {site.Start_Date__c
                              ? new Date(
                                  site.Start_Date__c
                                ).toLocaleDateString()
                              : "No start date"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {site.Builder_Account__r?.Name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start">
                          <MapPin className="h-3 w-3 mt-1 mr-2 text-gray-400 flex-shrink-0" />
                          <span className="text-sm">{formatAddress(site)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(site.Status__c)}>
                          {site.Status__c || "Unknown"}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {site.Is_Existing_Customer__c
                            ? "Existing Customer"
                            : "New Customer"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">
                            {site.Field_Visits__r?.records?.length || 0} visits
                          </p>
                          {site.Field_Visits__r?.records &&
                            site.Field_Visits__r.records.length > 0 && (
                              <p className="text-xs text-gray-500">
                                Last:{" "}
                                {new Date(
                                  site.Field_Visits__r.records[0].Check_In__c
                                ).toLocaleDateString()}
                              </p>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No project sites found matching your search
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Visit;

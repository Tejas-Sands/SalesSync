
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sun, Moon, DownloadCloud, Share2, Users, ShoppingCart, 
  DollarSign, TrendingUp, Map, AlertCircle, Zap, RefreshCcw,
  FileText, Bell, ChevronRight, Award, PieChart, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Bar, Legend, BarChart } from 'recharts';
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  exportDashboardData, shareDashboard, applyFilters, viewMetricDetails,
  viewTeamMemberDetails, viewAllInsights, viewInsightDetails, refreshDashboard,
  downloadReport, createAlert
} from "@/utils/dashboardActions";
import { useToast } from "@/hooks/use-toast";

const data = [
  { name: 'Jan', revenue: 4000, profit: 2400, units: 240 },
  { name: 'Feb', revenue: 3000, profit: 1398, units: 210 },
  { name: 'Mar', revenue: 2000, profit: 9800, units: 290 },
  { name: 'Apr', revenue: 2780, profit: 3908, units: 200 },
  { name: 'May', revenue: 1890, profit: 4800, units: 218 },
  { name: 'Jun', revenue: 2390, profit: 3800, units: 250 },
  { name: 'Jul', revenue: 3490, profit: 4300, units: 210 },
];

const productData = [
  { name: 'Product A', sales: 4000, target: 5000 },
  { name: 'Product B', sales: 3000, target: 3500 },
  { name: 'Product C', sales: 2000, target: 2000 },
  { name: 'Product D', sales: 2780, target: 3000 },
  { name: 'Product E', sales: 1890, target: 2500 },
];

const teamData = [
  { name: 'Alice', sales: 56000, leads: 45, target: 60000, avatar: "A", status: "active" },
  { name: 'Bob', sales: 72000, leads: 52, target: 70000, avatar: "B", status: "active" },
  { name: 'Charlie', sales: 48000, leads: 38, target: 50000, avatar: "C", status: "warning" },
  { name: 'Diana', sales: 67000, leads: 49, target: 65000, avatar: "D", status: "active" },
];

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("revenue");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [region, setRegion] = useState("All Regions");
  const [category, setCategory] = useState("All Categories");
  const [isLoading, setIsLoading] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Initialize dark mode based on system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: `${!isDarkMode ? 'Dark' : 'Light'} Mode Activated`,
      description: `The dashboard theme has been switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
      duration: 2000,
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleNavigation = (route: string) => {
    toast({
      title: `Navigating to ${route}`,
      description: `Loading ${route} page...`,
      duration: 2000,
    });
    // In a real app, this would navigate to the selected route
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    toast({
      title: `Viewing ${value} data`,
      description: `Switched to ${value} visualization`,
      duration: 2000,
    });
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    refreshDashboard();
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  const handleApplyFilters = () => {
    setIsLoading(true);
    const success = applyFilters({ dateRange, region, category });
    setTimeout(() => {
      setIsLoading(false);
      if (success) {
        setFiltersApplied(true);
      }
    }, 1000);
  };
  
  const handleDownloadReport = (type: string) => {
    downloadReport(type);
  };
  
  const handleCreateAlert = (metric: string) => {
    createAlert(metric, "drops below target");
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="flex flex-col md:flex-row">
        {/* Mobile header with menu toggle */}
        <div className={`md:hidden flex justify-between items-center p-4 sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800 border-b border-gray-700 glass' : 'bg-white border-b border-gray-200 glass'}`}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} gradient-text`}>SalesSync</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center mr-4">
              <Sun className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-amber-500'}`} />
              <Switch checked={isDarkMode} onCheckedChange={toggleTheme} className="mx-2" />
              <Moon className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-gray-400'}`} />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSidebar}
              className="p-1.5 h-8 w-8 hover-scale"
              aria-label="Toggle sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
              </svg>
            </Button>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className={`${isMobile ? (sidebarOpen ? 'fixed inset-y-0 left-0 z-40 w-72 transform translate-x-0' : 'fixed inset-y-0 left-0 z-40 w-72 transform -translate-x-full') : 'w-full md:w-64'} transition-transform duration-300 ease-in-out p-4 border-r ${isDarkMode ? 'border-gray-700 bg-gray-800 glass' : 'border-gray-200 bg-white glass'} md:h-screen`}>
          <div className="hidden md:flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} gradient-text`}>SalesSync</h2>
            <div className="flex items-center space-x-2">
              <Sun className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-amber-500'}`} />
              <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
              <Moon className={`h-4 w-4 ${isDarkMode ? 'text-blue-400' : 'text-gray-400'}`} />
            </div>
          </div>
          
          <nav className="space-y-2 mt-8 md:mt-0">
            <Button onClick={() => handleNavigation("Dashboard")} className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-all duration-200 ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </Button>
            
            <Button onClick={() => handleNavigation("Products")} className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`} variant="ghost">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Products</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Button>
            
            <Button onClick={() => handleNavigation("Team")} className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`} variant="ghost">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Team</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Button>
            
            <Button onClick={() => handleNavigation("Regional Sales")} className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`} variant="ghost">
              <div className="flex items-center space-x-2">
                <Map className="h-5 w-5" />
                <span>Regional Sales</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Button>
            
            <Button onClick={() => handleNavigation("Reports")} className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`} variant="ghost">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Reports</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Button>
            
            <Button onClick={() => handleNavigation("Forecasts")} className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`} variant="ghost">
              <div className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Forecasts</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Button>
          </nav>
          
          <div className="mt-8">
            <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Filters</h3>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} space-y-4 card-shadow`}>
              <div>
                <Label className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Date Range</Label>
                <select 
                  className={`mt-1.5 w-full p-2 text-sm rounded-md border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'} focus:ring-2 focus:ring-blue-500 transition-all`}
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option>Last 30 days</option>
                  <option>Last Quarter</option>
                  <option>Year to Date</option>
                  <option>Custom...</option>
                </select>
              </div>
              <div>
                <Label className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Region</Label>
                <select 
                  className={`mt-1.5 w-full p-2 text-sm rounded-md border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'} focus:ring-2 focus:ring-blue-500 transition-all`}
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option>All Regions</option>
                  <option>North America</option>
                  <option>Europe</option>
                  <option>Asia Pacific</option>
                </select>
              </div>
              <div>
                <Label className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Product Category</Label>
                <select 
                  className={`mt-1.5 w-full p-2 text-sm rounded-md border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'} focus:ring-2 focus:ring-blue-500 transition-all`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Software</option>
                  <option>Services</option>
                </select>
              </div>
              <Button 
                className={`w-full mt-3 ${filtersApplied ? 'bg-green-600 hover:bg-green-700' : ''}`} 
                size="sm"
                onClick={handleApplyFilters}
                disabled={isLoading}
              >
                {isLoading ? 'Applying...' : (filtersApplied ? 'Filters Applied ✓' : 'Apply Filters')}
              </Button>
            </div>
          </div>

          {/* Mobile sidebar close button */}
          {isMobile && sidebarOpen && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className="absolute top-4 right-4 p-1.5 h-8 w-8 md:hidden hover-scale"
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          )}
        </div>
        
        {/* Overlay for mobile sidebar */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm"
            onClick={toggleSidebar}
          />
        )}
        
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} gradient-text`}>Sales Dashboard</h1>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Welcome back! Last updated {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex items-center space-x-1 hover-scale"
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh dashboard data</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex items-center space-x-1 hover-scale"
                    onClick={exportDashboardData}
                  >
                    <DownloadCloud className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export dashboard data</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="hidden sm:flex items-center space-x-1 hover-scale"
                    onClick={shareDashboard}
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share this dashboard</TooltipContent>
              </Tooltip>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex sm:hidden p-2 hover-scale"
                onClick={handleRefresh}
                disabled={isLoading}
                aria-label="Refresh data"
              >
                <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex sm:hidden p-2 hover-scale"
                onClick={exportDashboardData}
                aria-label="Export data"
              >
                <DownloadCloud className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex sm:hidden p-2 hover-scale"
                onClick={shareDashboard}
                aria-label="Share dashboard"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Card 
                  className={`p-4 overflow-hidden relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} group transition-all duration-300 hover:shadow-lg cursor-pointer card-shadow card-gradient-blue metric-card`}
                  onClick={() => viewMetricDetails("Total Revenue")}
                >
                  <div className="flex items-center justify-between">
                    <div className="z-10">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Total Revenue</p>
                      <h3 className="text-2xl font-bold mt-1">$249,500</h3>
                      <p className="text-xs flex items-center text-green-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        +14% from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-full transition-all duration-300 group-hover:scale-110 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                      <DollarSign className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 h-16 w-16 -mb-4 -mr-4 rounded-full bg-blue-500 opacity-10 transform group-hover:scale-150 transition-transform duration-500"></div>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className={`card-shadow ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
                <div className="space-y-2">
                  <h4 className="font-medium">Revenue Breakdown</h4>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Direct Sales</span>
                      <span>$142,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Partner Sales</span>
                      <span>$89,750</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Referrals</span>
                      <span>$17,250</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Button size="sm" variant="outline" className="hover-scale" onClick={() => viewMetricDetails("Total Revenue")}>
                      View Details
                    </Button>
                    <Button size="sm" variant="ghost" className="hover-scale" onClick={() => handleCreateAlert("Revenue")}>
                      <Bell className="h-4 w-4 mr-1" /> Set Alert
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Card 
                  className={`p-4 overflow-hidden relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} group transition-all duration-300 hover:shadow-lg cursor-pointer card-shadow card-gradient-purple metric-card`}
                  onClick={() => viewMetricDetails("Avg. Deal Size")}
                >
                  <div className="flex items-center justify-between">
                    <div className="z-10">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Avg. Deal Size</p>
                      <h3 className="text-2xl font-bold mt-1">$5,280</h3>
                      <p className="text-xs flex items-center text-green-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        +5% from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-full transition-all duration-300 group-hover:scale-110 ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                      <TrendingUp className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 h-16 w-16 -mb-4 -mr-4 rounded-full bg-purple-500 opacity-10 transform group-hover:scale-150 transition-transform duration-500"></div>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className={`card-shadow ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
                <div className="space-y-2">
                  <h4 className="font-medium">Deal Size Insights</h4>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Enterprise</span>
                      <span>$12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mid-market</span>
                      <span>$6,320</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Small Business</span>
                      <span>$2,180</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Button size="sm" variant="outline" className="hover-scale" onClick={() => viewMetricDetails("Avg. Deal Size")}>
                      View Details
                    </Button>
                    <Button size="sm" variant="ghost" className="hover-scale" onClick={() => handleDownloadReport("Deal Size")}>
                      <FileText className="h-4 w-4 mr-1" /> Report
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            
            <HoverCard>
              <HoverCardTrigger asChild>
                <Card 
                  className={`p-4 overflow-hidden relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} group transition-all duration-300 hover:shadow-lg cursor-pointer card-shadow card-gradient-amber metric-card`}
                  onClick={() => viewMetricDetails("Products Sold")}
                >
                  <div className="flex items-center justify-between">
                    <div className="z-10">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Products Sold</p>
                      <h3 className="text-2xl font-bold mt-1">1,284</h3>
                      <p className="text-xs flex items-center text-red-500 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        -2% from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-full transition-all duration-300 group-hover:scale-110 ${isDarkMode ? 'bg-amber-900' : 'bg-amber-100'}`}>
                      <ShoppingCart className={`h-6 w-6 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 h-16 w-16 -mb-4 -mr-4 rounded-full bg-amber-500 opacity-10 transform group-hover:scale-150 transition-transform duration-500"></div>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className={`card-shadow ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
                <div className="space-y-2">
                  <h4 className="font-medium">Top Products</h4>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span>Product A</span>
                      <span>428 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Product B</span>
                      <span>352 units</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Product C</span>
                      <span>298 units</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Button size="sm" variant="outline" className="hover-scale" onClick={() => viewMetricDetails("Products Sold")}>
                      View Details
                    </Button>
                    <Button size="sm" variant="ghost" className="hover-scale" onClick={() => handleNavigation("Inventory")}>
                      <ShoppingCart className="h-4 w-4 mr-1" /> Inventory
                    </Button>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className={`col-span-1 lg:col-span-2 p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} transition-all duration-300 hover:shadow-lg card-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Revenue Trends</h3>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs hover-scale"
                    onClick={() => handleDownloadReport("Revenue Trends")}
                  >
                    <FileText className="h-3.5 w-3.5 mr-1" /> Export
                  </Button>
                </div>
              </div>
              <Tabs defaultValue="revenue" className="w-full" value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-4 w-full justify-start">
                  <TabsTrigger value="revenue" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Revenue</TabsTrigger>
                  <TabsTrigger value="units" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">Units Sold</TabsTrigger>
                  <TabsTrigger value="profit" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">Profit</TabsTrigger>
                </TabsList>
                <TabsContent value="revenue" className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#eee'} />
                      <XAxis dataKey="name" stroke={isDarkMode ? '#aaa' : '#666'} />
                      <YAxis stroke={isDarkMode ? '#aaa' : '#666'} />
                      <RechartsTooltip contentStyle={isDarkMode ? { backgroundColor: '#333', borderColor: '#555', color: '#fff' } : {}} />
                      <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="units" className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#eee'} />
                      <XAxis dataKey="name" stroke={isDarkMode ? '#aaa' : '#666'} />
                      <YAxis stroke={isDarkMode ? '#aaa' : '#666'} />
                      <RechartsTooltip contentStyle={isDarkMode ? { backgroundColor: '#333', borderColor: '#555', color: '#fff' } : {}} />
                      <Area type="monotone" dataKey="units" stroke="#10b981" fillOpacity={1} fill="url(#colorUnits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="profit" className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#eee'} />
                      <XAxis dataKey="name" stroke={isDarkMode ? '#aaa' : '#666'} />
                      <YAxis stroke={isDarkMode ? '#aaa' : '#666'} />
                      <RechartsTooltip contentStyle={isDarkMode ? { backgroundColor: '#333', borderColor: '#555', color: '#fff' } : {}} />
                      <Area type="monotone" dataKey="profit" stroke="#a855f7" fillOpacity={1} fill="url(#colorProfit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </Card>
            
            <Card className={`p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} transition-all duration-300 hover:shadow-lg card-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Product Performance</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover-scale"
                  onClick={() => handleNavigation("Product Details")}
                >
                  View All
                </Button>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#444' : '#eee'} />
                    <XAxis dataKey="name" stroke={isDarkMode ? '#aaa' : '#666'} />
                    <YAxis stroke={isDarkMode ? '#aaa' : '#666'} />
                    <RechartsTooltip 
                      contentStyle={isDarkMode ? { backgroundColor: '#333', borderColor: '#555', color: '#fff' } : {}}
                      cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill={isDarkMode ? '#666' : '#ddd'} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
          
          {/* Team Performance and AI Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className={`col-span-1 lg:col-span-2 p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} transition-all duration-300 hover:shadow-lg card-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Team Performance</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs hover-scale"
                  onClick={() => handleNavigation("Team Management")}
                >
                  <Users className="h-3.5 w-3.5 mr-1" /> Manage Team
                </Button>
              </div>
              <div className="space-y-4">
                {teamData.map((member, index) => (
                  <div 
                    key={member.name} 
                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors duration-200 cursor-pointer staggered-item`}
                    onClick={() => viewTeamMemberDetails(member.name)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                          {member.avatar}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{member.name}</h4>
                            <span className={`status-badge ml-2 ${member.status === 'active' ? 'status-active' : 'status-warning'}`}></span>
                          </div>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{member.leads} new leads</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>${member.sales.toLocaleString()}</p>
                        <p className={`text-sm ${member.sales >= member.target ? 'text-green-500' : 'text-amber-500'}`}>
                          {Math.round((member.sales / member.target) * 100)}% of target
                        </p>
                      </div>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-full transition-all duration-500 ease-in-out animate-progress ${member.sales >= member.target ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ 
                          width: `${Math.min(100, Math.round((member.sales / member.target) * 100))}%`,
                          ['--progress-width' as any]: `${Math.min(100, Math.round((member.sales / member.target) * 100))}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className={`p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} transition-all duration-300 hover:shadow-lg card-shadow`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>AI Insights</h3>
                <span className={`text-xs px-2 py-1 rounded-full flex items-center ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  <span className="pulse inline-block h-1.5 w-1.5 rounded-full bg-purple-500 mr-1"></span>
                  Updated 5m ago
                </span>
              </div>
              
              <div className="space-y-4">
                <div 
                  className={`p-3 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'} transition-transform duration-200 hover:-translate-y-1 cursor-pointer staggered-item`}
                  onClick={() => viewInsightDetails("Product Recommendation")}
                >
                  <div className="flex items-center space-x-2">
                    <Zap className={`h-4 w-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                    <h4 className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Product Recommendation</h4>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Product C has reached 100% of its target. Consider increasing inventory by 15% for next month.
                  </p>
                </div>
                
                <div 
                  className={`p-3 rounded-lg border-l-4 border-amber-500 ${isDarkMode ? 'bg-gray-700' : 'bg-amber-50'} transition-transform duration-200 hover:-translate-y-1 cursor-pointer staggered-item`}
                  onClick={() => viewInsightDetails("Trend Alert")}
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className={`h-4 w-4 ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`} />
                    <h4 className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>Trend Alert</h4>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Sales in the Midwest region have dropped by 12% compared to last month. Schedule a team review.
                  </p>
                </div>
                
                <div 
                  className={`p-3 rounded-lg border-l-4 border-green-500 ${isDarkMode ? 'bg-gray-700' : 'bg-green-50'} transition-transform duration-200 hover:-translate-y-1 cursor-pointer staggered-item`}
                  onClick={() => viewInsightDetails("Opportunity Detected")}
                >
                  <div className="flex items-center space-x-2">
                    <Zap className={`h-4 w-4 ${isDarkMode ? 'text-green-300' : 'text-green-600'}`} />
                    <h4 className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>Opportunity Detected</h4>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Customers who purchase Product A are 3x more likely to also purchase Product E. Consider bundling.
                  </p>
                </div>
                
                <div 
                  className={`p-3 rounded-lg border-l-4 border-purple-500 ${isDarkMode ? 'bg-gray-700' : 'bg-purple-50'} transition-transform duration-200 hover:-translate-y-1 cursor-pointer staggered-item`}
                  onClick={() => viewInsightDetails("Performance Recognition")}
                >
                  <div className="flex items-center space-x-2">
                    <Award className={`h-4 w-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                    <h4 className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>Performance Recognition</h4>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Bob has exceeded targets for 3 consecutive months. Consider a performance incentive.
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover-scale" size="sm" onClick={viewAllInsights}>
                View All Insights
              </Button>
            </Card>
          </div>
          
          {/* Footer with attribution */}
          <div className={`mt-8 pt-4 border-t ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'} flex items-center justify-between text-xs`}>
            <p>© 2023 SalesSync | Last updated: {new Date().toLocaleDateString()}</p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-xs hover-scale" onClick={() => handleNavigation("Help")}>
                Need Help?
              </Button>
              <Button variant="ghost" size="sm" className="text-xs hover-scale" onClick={() => handleNavigation("Support")}>
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

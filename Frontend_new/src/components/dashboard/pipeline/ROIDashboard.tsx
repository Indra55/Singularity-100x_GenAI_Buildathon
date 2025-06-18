
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  BarChart3,
  Users,
  Award,
  Calendar
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ROIDashboard = ({ user, stats }) => {
  const [timeRange, setTimeRange] = useState("90d");

  // Mock ROI data
  const costData = [
    { month: "Jan", recruiting: 45000, hiring: 12000, training: 8000, total: 65000 },
    { month: "Feb", recruiting: 38000, hiring: 15000, training: 7000, total: 60000 },
    { month: "Mar", recruiting: 42000, hiring: 18000, training: 9000, total: 69000 },
    { month: "Apr", recruiting: 35000, hiring: 14000, training: 6000, total: 55000 },
    { month: "May", recruiting: 40000, hiring: 16000, training: 8000, total: 64000 },
    { month: "Jun", recruiting: 32000, hiring: 13000, training: 7000, total: 52000 }
  ];

  const sourceROIData = [
    { source: "LinkedIn", cost: 15000, hires: 12, costPerHire: 1250, revenue: 180000 },
    { source: "Referrals", cost: 8000, hires: 15, costPerHire: 533, revenue: 225000 },
    { source: "Direct Apply", cost: 3000, hires: 8, costPerHire: 375, revenue: 120000 },
    { source: "GitHub", cost: 12000, hires: 6, costPerHire: 2000, revenue: 90000 },
    { source: "Agency", cost: 45000, hires: 10, costPerHire: 4500, revenue: 150000 }
  ];

  const timeToFillData = [
    { role: "AI Engineer", industry: 45, company: 28, savings: 17 },
    { role: "ML Engineer", industry: 38, company: 21, savings: 17 },
    { role: "Data Scientist", industry: 30, company: 25, savings: 5 },
    { role: "AI Product Manager", industry: 40, company: 32, savings: 8 },
    { role: "Research Scientist", industry: 52, company: 42, savings: 10 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const totalRevenue = sourceROIData.reduce((sum, item) => sum + item.revenue, 0);
  const totalCost = sourceROIData.reduce((sum, item) => sum + item.cost, 0);
  const totalHires = sourceROIData.reduce((sum, item) => sum + item.hires, 0);
  const avgCostPerHire = totalCost / totalHires;
  const roi = ((totalRevenue - totalCost) / totalCost * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recruitment ROI Dashboard</h2>
        <div className="flex gap-2">
          {["30d", "90d", "1y"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-pulse-500 hover:bg-pulse-600" : ""}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* ROI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total ROI</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">{roi.toFixed(1)}%</h3>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% vs last quarter
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg Cost per Hire</p>
                <h3 className="text-2xl font-bold mt-1">${avgCostPerHire.toLocaleString()}</h3>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingDown className="w-3 h-3 inline mr-1" />
                  18% below industry avg
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-pulse-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Revenue Impact</p>
                <h3 className="text-2xl font-bold mt-1">${(totalRevenue/1000).toFixed(0)}K</h3>
                <p className="text-xs text-blue-600 mt-1">
                  From {totalHires} successful hires
                </p>
              </div>
              <Award className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Time Savings</p>
                <h3 className="text-2xl font-bold mt-1">57 days</h3>
                <p className="text-xs text-green-600 mt-1">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Faster than industry
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-pulse-500" />
            Cost Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                <Legend />
                <Bar dataKey="recruiting" stackId="a" fill="#8884d8" name="Recruiting Costs" />
                <Bar dataKey="hiring" stackId="a" fill="#82ca9d" name="Hiring Costs" />
                <Bar dataKey="training" stackId="a" fill="#ffc658" name="Training Costs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg Monthly Spend</p>
              <p className="text-2xl font-bold">${(costData.reduce((sum, item) => sum + item.total, 0) / costData.length / 1000).toFixed(0)}K</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Cost Reduction</p>
              <p className="text-2xl font-bold text-green-600">23%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Efficiency Gain</p>
              <p className="text-2xl font-bold text-blue-600">+34%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Source Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-pulse-500" />
              ROI by Source Channel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceROIData
                .sort((a, b) => (b.revenue - b.cost) - (a.revenue - a.cost))
                .map((source, index) => (
                <div key={source.source} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} 
                         style={{ backgroundColor: COLORS[index % COLORS.length] + '20' }}>
                      <Users className="w-5 h-5" style={{ color: COLORS[index % COLORS.length] }} />
                    </div>
                    <div>
                      <h4 className="font-medium">{source.source}</h4>
                      <p className="text-sm text-gray-500">{source.hires} hires</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${((source.revenue - source.cost) / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-gray-500">ROI: {(((source.revenue - source.cost) / source.cost) * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-pulse-500" />
              Time-to-Fill vs Industry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeToFillData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="role" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="industry" fill="#8884d8" name="Industry Avg" />
                  <Bar dataKey="company" fill="#82ca9d" name="Your Company" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Benchmarks */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Benchmarks & Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Cost Efficiency</h4>
              <p className="text-3xl font-bold text-green-600">+23%</p>
              <p className="text-sm text-gray-500">Above industry average</p>
              <Badge className="bg-green-100 text-green-800 mt-2">Top 15%</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Speed to Hire</h4>
              <p className="text-3xl font-bold text-blue-600">+32%</p>
              <p className="text-sm text-gray-500">Faster than average</p>
              <Badge className="bg-blue-100 text-blue-800 mt-2">Top 10%</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Quality Score</h4>
              <p className="text-3xl font-bold text-purple-600">8.7/10</p>
              <p className="text-sm text-gray-500">Candidate satisfaction</p>
              <Badge className="bg-purple-100 text-purple-800 mt-2">Excellent</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Retention Rate</h4>
              <p className="text-3xl font-bold text-orange-600">94%</p>
              <p className="text-sm text-gray-500">12-month retention</p>
              <Badge className="bg-orange-100 text-orange-800 mt-2">Outstanding</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ROIDashboard;

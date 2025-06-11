
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, TrendingUp, Clock, Users, ListCheck } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Analytics = ({ user }) => {
  // Mock data for charts
  const timeToHireData = [
    { name: 'AI Engineer', industry: 45, company: 28 },
    { name: 'ML Engineer', industry: 38, company: 21 },
    { name: 'Data Scientist', industry: 30, company: 25 },
    { name: 'AI Product Manager', industry: 40, company: 32 },
    { name: 'Research Scientist', industry: 52, company: 42 },
  ];

  const candidateSourceData = [
    { name: 'LinkedIn', value: 45 },
    { name: 'Referrals', value: 25 },
    { name: 'Direct Applications', value: 15 },
    { name: 'GitHub', value: 10 },
    { name: 'Other', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const activityData = [
    { date: 'Week 1', searches: 12, outreach: 8, responses: 3 },
    { date: 'Week 2', searches: 18, outreach: 15, responses: 6 },
    { date: 'Week 3', searches: 24, outreach: 20, responses: 9 },
    { date: 'Week 4', searches: 28, outreach: 25, responses: 14 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Time-to-Hire</p>
                <h3 className="text-2xl font-bold mt-1">28 days</h3>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline-block mr-1" />
                  38% below industry average
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Searches</p>
                <h3 className="text-2xl font-bold mt-1">5</h3>
                <p className="text-xs text-gray-500 mt-1">
                  3 AI Engineer, 2 Data Scientist
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ListCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Candidate Pool</p>
                <h3 className="text-2xl font-bold mt-1">458</h3>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline-block mr-1" />
                  +24 this week
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Outreach Response</p>
                <h3 className="text-2xl font-bold mt-1">68%</h3>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline-block mr-1" />
                  15% above industry average
                </p>
              </div>
              <div className="w-10 h-10 bg-pulse-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-pulse-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-pulse-500" />
              Time-to-Hire by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={timeToHireData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar name="Industry Avg" dataKey="industry" fill="#8884d8" />
                  <Bar name="Your Company" dataKey="company" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-pulse-500" />
              Candidate Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart width={400} height={300}>
                  <Pie
                    data={candidateSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {candidateSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-pulse-500" />
            Recruiting Activity Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                width={500}
                height={300}
                data={activityData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="searches" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="outreach" stroke="#f97316" />
                <Line type="monotone" dataKey="responses" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Benchmarking */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Industry Benchmarks</CardTitle>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h4 className="font-medium">Average Time-to-Hire</h4>
                <p className="text-sm text-gray-500">AI Engineering Roles</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">28 days</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  38% faster
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h4 className="font-medium">Outreach Response Rate</h4>
                <p className="text-sm text-gray-500">Across all channels</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">68%</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  15% higher
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h4 className="font-medium">Cost per Hire</h4>
                <p className="text-sm text-gray-500">Technical positions</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">$12,800</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  22% lower
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Candidate Quality Score</h4>
                <p className="text-sm text-gray-500">Based on match accuracy</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">8.7/10</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Top 10%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  getDashboardStats, 
  getPerformanceReport, 
  getAttendanceReport, 
  getAllFees, 
  createFee, 
  updateFee,
  getUserList 
} from "../api/adminApi";

import { FeeModal } from "../components/admin/FeeModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, Activity, DollarSign, Calendar, Search, 
  Plus, Filter, FileText, CheckCircle, XCircle, Clock
} from "lucide-react";

// Simple Tabs Component (since we don't have one in UI folder yet)
const Tabs = ({ activeTab, onTabChange, children }) => (
  <div className="w-full space-y-4">{children}</div>
);
const TabsList = ({ children }) => (
  <div className="flex space-x-1 rounded-lg bg-muted p-1">{children}</div>
);
const TabsTrigger = ({ value, activeTab, onClick, children }) => (
  <button
    onClick={() => onClick(value)}
    className={`flex-1 px-3 py-1.5 text-sm font-medium transition-all rounded-md 
      ${activeTab === value ? "bg-background shadow text-foreground" : "text-muted-foreground hover:bg-background/50"}`}
  >
    {children}
  </button>
);
const TabsContent = ({ value, activeTab, children }) => {
  if (value !== activeTab) return null;
  return <div className="animate-in fade-in-50 duration-300">{children}</div>;
};

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fee Modal State
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  // Fetch Data based on Tab
  useEffect(() => {
    // Always fetch overview stats initially
    fetchOverview();

    if (activeTab === "performance") fetchPerformance();
    if (activeTab === "attendance") fetchAttendance();
    if (activeTab === "fees") {
      fetchFees();
      fetchUsers(); // For the dropdown
    }
  }, [activeTab]);

  const fetchOverview = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  const fetchPerformance = async () => {
    try {
      const data = await getPerformanceReport();
      setPerformanceData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const data = await getAttendanceReport();
      setAttendanceData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFees = async () => {
    try {
      const data = await getAllFees();
      setFeesData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUserList();
      setUsers(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFeeSubmit = async (data) => {
    try {
      if (editingFee) {
        await updateFee(editingFee._id, data);
      } else {
        await createFee(data);
      }
      fetchFees(); // Refresh
      fetchOverview(); // Update totals
    } catch (error) {
      console.error(error);
      alert("Failed to save fee record");
      throw error;
    }
  };

  // Filter Logic
  const getFilteredData = (data, fields = ["name", "email"]) => {
    return data.filter(item => {
      const matchesSearch = fields.some(field => 
        (item[field] || item.userId?.[field] || "").toLowerCase().includes(searchTerm)
      );
      if (statusFilter === "all") return matchesSearch;
      
      // Handle status filter per tab
      if (activeTab === "fees") return matchesSearch && item.status === statusFilter;
      // You can add more specific status logic for other tabs if needed
      return matchesSearch;
    });
  };

  if (user?.role !== "admin") {
    return <div className="flex h-full items-center justify-center">Access Denied</div>;
  }

  return (
    <div className="h-full bg-background p-6 md:p-10 space-y-8 overflow-y-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage students, performance, and fees.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
          <Button variant="ghost" size="sm" onClick={() => fetchOverview()}>
             Refresh Data
          </Button>
        </div>
      </div>

      <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="w-full md:w-[400px]">
          <TabsList>
            <TabsTrigger value="overview" activeTab={activeTab} onClick={setActiveTab}>Overview</TabsTrigger>
            <TabsTrigger value="performance" activeTab={activeTab} onClick={setActiveTab}>Performance</TabsTrigger>
            <TabsTrigger value="attendance" activeTab={activeTab} onClick={setActiveTab}>Attendance</TabsTrigger>
            <TabsTrigger value="fees" activeTab={activeTab} onClick={setActiveTab}>Fees</TabsTrigger>
          </TabsList>
        </div>

        {/* --- Overview Tab --- */}
        <TabsContent value="overview" activeTab={activeTab}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">{stats?.activeUsers || 0} active</p>
              </CardContent>
            </Card>
           
            {/* You could add Total Fees here if endpoint returned it in stats */}
          </div>
        </TabsContent>

        {/* --- Shared Filters Toolbar --- */}
        {activeTab !== "overview" && (
          <div className="flex flex-col md:flex-row gap-4 my-6 items-center justify-between">
             <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             
             <div className="flex gap-2 w-full md:w-auto">
               {activeTab === "fees" && (
                 <select 
                   className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                 >
                   <option value="all">All Status</option>
                   <option value="paid">Paid</option>
                   <option value="unpaid">Unpaid</option>
                   <option value="partial">Partial</option>
                 </select>
               )}
               
               {activeTab === "fees" && (
                 <Button onClick={() => { setEditingFee(null); setIsFeeModalOpen(true); }}>
                   <Plus className="mr-2 h-4 w-4" /> Add Fee
                 </Button>
               )}
             </div>
          </div>
        )}

        {/* --- Performance Tab --- */}
        <TabsContent value="performance" activeTab={activeTab}>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Avg WPM</TableHead>
                  <TableHead>Best WPM</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Sessions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredData(performanceData).length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4">No data found</TableCell></TableRow>
                ) : (
                  getFilteredData(performanceData).map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell className="font-mono">{user.practiceStats?.avgWpm || 0}</TableCell>
                      <TableCell className="font-mono">{user.practiceStats?.bestWpm || 0}</TableCell>
                      <TableCell className="font-mono">{user.practiceStats?.avgAccuracy || 0}%</TableCell>
                      <TableCell>{user.practiceStats?.totalSessions || 0}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* --- Attendance Tab --- */}
        <TabsContent value="attendance" activeTab={activeTab}>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Ongoing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredData(attendanceData).length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-4">No data found</TableCell></TableRow>
                ) : (
                  getFilteredData(attendanceData).map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.attendance?.attendanceRate > 75 ? "outline" : "secondary"}>
                          {user.attendance?.attendanceRate || 0}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">{user.attendance?.presentDays || 0}</TableCell>
                      <TableCell className="text-red-500 font-medium">{user.attendance?.absentDays || 0}</TableCell>
                      <TableCell className="text-yellow-600">{user.attendance?.ongoingDays || 0}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* --- Fees Tab --- */}
        <TabsContent value="fees" activeTab={activeTab}>
           <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredData(feesData).length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-4">No records found</TableCell></TableRow>
                ) : (
                  getFilteredData(feesData).map((fee) => (
                    <TableRow key={fee._id}>
                      <TableCell>
                         <div className="font-medium">{fee.userId?.name || 'Unknown'}</div>
                         <div className="text-xs text-muted-foreground">{fee.userId?.email}</div>
                      </TableCell>
                      <TableCell>{fee.month}</TableCell>
                      <TableCell>₹{fee.amount}</TableCell>
                      <TableCell>₹{fee.paidAmount}</TableCell>
                      <TableCell>
                        <Badge className={`${
                          fee.status === 'paid' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 
                          fee.status === 'partial' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' : 
                          'bg-red-100 text-red-800 hover:bg-red-100'
                        }`}>
                          {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => { setEditingFee(fee); setIsFeeModalOpen(true); }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <FeeModal 
        open={isFeeModalOpen} 
        onClose={() => setIsFeeModalOpen(false)} 
        onSubmit={handleFeeSubmit}
        initialData={editingFee}
        users={users}
      />
    </div>
  );
}

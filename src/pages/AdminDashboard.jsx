import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  getDashboardStats, 
  getPerformanceReport, 
  getAttendanceReport, 
  getAllFees, 
  createFee, 
  updateFee,
  getUserList,
  getAllStudents
} from "../api/adminApi";
import { getSlotAvailability, updateAdmission } from "../api/admissionApi";

import { FeeModal } from "../components/admin/FeeModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, Activity, DollarSign, Calendar, Search, 
  Plus, Filter, FileText, CheckCircle, XCircle, Clock,
  GraduationCap, Eye, EyeOff, Copy, ChevronDown, ChevronUp, RefreshCw
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

// Password cell component
const PasswordCell = ({ password }) => {
  const [visible, setVisible] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password || "");
    alert("Password copied!");
  };
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-sm">{visible ? password : "••••••"}</span>
      <button onClick={() => setVisible(!visible)} className="p-1 hover:bg-muted rounded">
        {visible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </button>
      <button onClick={copyToClipboard} className="p-1 hover:bg-muted rounded">
        <Copy className="h-3 w-3" />
      </button>
    </div>
  );
};

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [feesData, setFeesData] = useState([]);
  const [users, setUsers] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");

  // Expanded student
  const [expandedStudent, setExpandedStudent] = useState(null);

  // Fee Modal State
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  // Batch Change State
  const [slotData, setSlotData] = useState([]);
  const [changingBatchFor, setChangingBatchFor] = useState(null); // student _id

  // Fetch Data based on Tab
  useEffect(() => {
    // Always fetch overview stats initially
    fetchOverview();

    if (activeTab === "students") {
      fetchStudents();
      fetchBatches();
    }
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

  const fetchStudents = async () => {
    try {
      const data = await getAllStudents();
      setStudentsData(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await getSlotAvailability();
      setSlotData(res.data || []);
    } catch (error) {
      console.error(error);
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
        (item[field] || item.userId?.[field] || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (statusFilter === "all") return matchesSearch;
      
      // Handle status filter per tab
      if (activeTab === "fees") return matchesSearch && item.status === statusFilter;
      return matchesSearch;
    });
  };

  // Students filter (special — also filters by course & batch)
  const getFilteredStudents = () => {
    return studentsData.filter(s => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = 
        (s.firstName || "").toLowerCase().includes(search) ||
        (s.surname || "").toLowerCase().includes(search) ||
        (s.mobile || "").includes(search) ||
        (s.grNo || "").toLowerCase().includes(search) ||
        (s.loginUsername || "").toLowerCase().includes(search) ||
        (s.adharNo || "").includes(search);

      const matchesCourse = courseFilter === "all" || 
        (s.selectedCourses || []).includes(courseFilter);

      const matchesBatch = batchFilter === "all" || 
        (s.batchTime || []).includes(batchFilter);

      return matchesSearch && matchesCourse && matchesBatch;
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
        <div className="w-full md:w-[550px]">
          <TabsList>
            <TabsTrigger value="overview" activeTab={activeTab} onClick={setActiveTab}>Overview</TabsTrigger>
            <TabsTrigger value="students" activeTab={activeTab} onClick={setActiveTab}>Students</TabsTrigger>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Admissions</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studentsData.length || 0}</div>
                <p className="text-xs text-muted-foreground">registered students</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* --- Shared Filters Toolbar --- */}
        {activeTab !== "overview" && (
          <div className="flex flex-col md:flex-row gap-4 my-6 items-center justify-between">
             <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={activeTab === "students" ? "Search name, GR No, mobile, username..." : "Search students..."}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             
             <div className="flex gap-2 w-full md:w-auto flex-wrap">
               {activeTab === "students" && (
                 <>
                   <select 
                     className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                     value={courseFilter}
                     onChange={(e) => setCourseFilter(e.target.value)}
                   >
                     <option value="all">All Courses</option>
                     <option value="english_30">English 30 WPM</option>
                     <option value="english_40">English 40 WPM</option>
                     <option value="english_50">English 50 WPM</option>
                     <option value="marathi_30">Marathi 30 WPM</option>
                     <option value="marathi_40">Marathi 40 WPM</option>
                     <option value="hindi_30">Hindi 30 WPM</option>
                     <option value="hindi_40">Hindi 40 WPM</option>
                   </select>
                   <select 
                     className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                     value={batchFilter}
                     onChange={(e) => setBatchFilter(e.target.value)}
                   >
                     <option value="all">All Batches</option>
                     <option value="10am-11am">10am-11am</option>
                     <option value="11am-12pm">11am-12pm</option>
                     <option value="4pm-5pm">4pm-5pm</option>
                     <option value="5pm-6pm">5pm-6pm</option>
                     <option value="6pm-7pm">6pm-7pm</option>
                     <option value="7pm-8pm">7pm-8pm</option>
                     <option value="8pm-9pm">8pm-9pm</option>
                     <option value="9pm-10pm">9pm-10pm</option>
                   </select>
                 </>
               )}

               {activeTab === "fees" && (
                 <>
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
                   <Button onClick={() => { setEditingFee(null); setIsFeeModalOpen(true); }}>
                     <Plus className="mr-2 h-4 w-4" /> Add Fee
                   </Button>
                 </>
               )}
             </div>
          </div>
        )}

        {/* --- Students Tab --- */}
        <TabsContent value="students" activeTab={activeTab}>
          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>GR No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Batch Time</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Admission Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredStudents().length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No students found</TableCell></TableRow>
                ) : (
                  getFilteredStudents().map((s) => (
                    <React.Fragment key={s._id}>
                      <TableRow 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setExpandedStudent(expandedStudent === s._id ? null : s._id)}
                      >
                        <TableCell className="w-8">
                          {expandedStudent === s._id 
                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> 
                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </TableCell>
                        <TableCell className="font-mono font-bold">{s.grNo}</TableCell>
                        <TableCell>
                          <div className="font-medium">{s.firstName} {s.surname}</div>
                        </TableCell>
                        <TableCell className="text-sm">{s.mobile}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(s.selectedCourses || []).map(c => (
                              <Badge key={c} variant="outline" className="text-xs">{c.replace('_', ' ').toUpperCase()}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(s.batchTime) ? s.batchTime : s.batchTime ? [s.batchTime] : []).map(b => (
                              <Badge key={b} variant="secondary" className="text-xs">{b}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-0.5 rounded text-sm">{s.loginUsername || "-"}</code>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <PasswordCell password={s.loginPassword} />
                        </TableCell>
                        <TableCell className="text-sm">
                          {s.admissionDate ? new Date(s.admissionDate).toLocaleDateString("en-IN") : "-"}
                        </TableCell>
                      </TableRow>

                      {/* Expanded Detail Row */}
                      {expandedStudent === s._id && (
                        <TableRow>
                          <TableCell colSpan={9} className="bg-muted/30 p-0">
                            <div className="p-6 space-y-4">
                              <h3 className="font-semibold text-base border-b pb-2">Complete Student Information</h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                                {/* Personal */}
                                <div><span className="text-muted-foreground block text-xs">Surname</span><span className="font-medium">{s.surname || "-"}</span></div>
                                <div><span className="text-muted-foreground block text-xs">First Name</span><span className="font-medium">{s.firstName || "-"}</span></div>
                                <div><span className="text-muted-foreground block text-xs">Father's Name</span><span className="font-medium">{s.fatherName || "-"}</span></div>
                                <div><span className="text-muted-foreground block text-xs">Mother's Name</span><span className="font-medium">{s.motherName || "-"}</span></div>

                                {/* Contact */}
                                <div><span className="text-muted-foreground block text-xs">Mobile</span><span className="font-medium">{s.mobile || "-"}</span></div>
                                <div><span className="text-muted-foreground block text-xs">Parent Mobile</span><span className="font-medium">{s.parentMobile || "-"}</span></div>
                                <div><span className="text-muted-foreground block text-xs">Email</span><span className="font-medium">{s.email || "-"}</span></div>
                                <div className="md:col-span-2"><span className="text-muted-foreground block text-xs">Address</span><span className="font-medium">{s.address || "-"}</span></div>

                                {/* Academic & Identity */}
                                <div><span className="text-muted-foreground block text-xs">School / College</span><span className="font-medium">{s.schoolName || "-"}</span></div>
                                <div><span className="text-muted-foreground block text-xs">Qualification</span><span className="font-medium">{s.qualification || "-"}</span></div>
                                <div><span className="text-muted-foreground block text-xs">Adhar Card No.</span><span className="font-medium font-mono">{s.adharNo || "-"}</span></div>
                                <div><span className="text-muted-foreground block text-xs">Date of Birth</span><span className="font-medium">{s.dob ? new Date(s.dob).toLocaleDateString("en-IN") : "-"}</span></div>
                                <div><span className="text-muted-foreground block text-xs">Handicapped</span><span className="font-medium">{s.handicapped ? "Yes" : "No"}</span></div>

                                {/* Office Use */}
                                <div><span className="text-muted-foreground block text-xs">G.R. No</span><span className="font-medium font-mono font-bold">{s.grNo || "-"}</span></div>
                                <div><span className="text-muted-foreground block text-xs">Admission Date</span><span className="font-medium">{s.admissionDate ? new Date(s.admissionDate).toLocaleDateString("en-IN") : "-"}</span></div>

                                {/* Credentials */}
                                <div><span className="text-muted-foreground block text-xs">Login Username</span><code className="bg-muted px-2 py-0.5 rounded text-sm">{s.loginUsername || "-"}</code></div>
                                <div onClick={(e) => e.stopPropagation()}><span className="text-muted-foreground block text-xs">Login Password</span><PasswordCell password={s.loginPassword} /></div>
                              </div>

                              {/* Courses & Docs */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                                <div>
                                  <span className="text-muted-foreground text-xs block mb-1">Selected Courses</span>
                                  <div className="flex flex-wrap gap-1">
                                    {(s.selectedCourses || []).length > 0 
                                      ? s.selectedCourses.map(c => <Badge key={c} variant="outline">{c.replace('_', ' ').toUpperCase()}</Badge>)
                                      : <span className="text-sm text-muted-foreground">None</span>}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground text-xs block mb-1">Batch Time(s)</span>
                                  <div className="flex flex-wrap gap-1">
                                    {(Array.isArray(s.batchTime) ? s.batchTime : s.batchTime ? [s.batchTime] : []).length > 0
                                      ? (Array.isArray(s.batchTime) ? s.batchTime : [s.batchTime]).map(b => <Badge key={b} variant="secondary">{b}</Badge>)
                                      : <span className="text-sm text-muted-foreground">None</span>}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground text-xs block mb-1">Submitted Documents</span>
                                  <div className="flex flex-wrap gap-1">
                                    {(s.submittedDocuments || []).length > 0
                                      ? s.submittedDocuments.map(d => <Badge key={d} variant="outline">{d.replace('_', ' ').toUpperCase()}</Badge>)
                                      : <span className="text-sm text-muted-foreground">None</span>}
                                  </div>
                                </div>
                              </div>

                              {/* Batch Change */}
                              <div className="pt-2 border-t">
                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="text-muted-foreground text-xs">Change Batch:</span>
                                  {changingBatchFor === s._id ? (
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {slotData.length > 0 ? slotData.map(slot => (
                                        <Button
                                          key={slot.slot}
                                          size="sm"
                                          variant={slot.isFull ? "ghost" : "outline"}
                                          disabled={slot.isFull}
                                          className={`text-xs ${slot.isFull ? 'opacity-40' : ''} ${(s.batchTime || []).includes(slot.slot) ? 'ring-2 ring-primary' : ''}`}
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            if (slot.isFull) return;
                                            try {
                                              await updateAdmission(s._id, { batchTime: [slot.slot] });
                                              alert(`Batch changed to ${slot.slot}`);
                                              fetchStudents();
                                              fetchBatches();
                                              setChangingBatchFor(null);
                                            } catch (err) {
                                              alert(err.response?.data?.error || 'Failed to change batch');
                                            }
                                          }}
                                        >
                                          {slot.slot} ({slot.count}/{slot.max})
                                          {slot.isFull && ' FULL'}
                                        </Button>
                                      )) : (
                                        <span className="text-xs text-muted-foreground">Loading slots...</span>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-xs"
                                        onClick={(e) => { e.stopPropagation(); setChangingBatchFor(null); }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-xs gap-1"
                                      onClick={(e) => { e.stopPropagation(); setChangingBatchFor(s._id); }}
                                    >
                                      <RefreshCw className="h-3 w-3" /> Change Batch
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Showing {getFilteredStudents().length} of {studentsData.length} students
          </div>
        </TabsContent>

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

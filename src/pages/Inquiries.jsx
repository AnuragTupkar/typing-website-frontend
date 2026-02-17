import React, { useState, useEffect } from "react";
import { createInquiry, getAllInquiries, deleteInquiry } from "../api/inquiryApi";
import { generateInquiryPDF } from "../utils/pdfGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2, IndianRupee, FileText } from "lucide-react";

const SUBJECTS_LIST = [
  { id: 'eng_30', label: 'English 30' },
  { id: 'eng_40', label: 'English 40' },
  { id: 'mar_30', label: 'Marathi 30' },
  { id: 'mar_40', label: 'Marathi 40' },
  { id: 'hindi_30', label: 'Hindi 30' },
  { id: 'hindi_40', label: 'Hindi 40' }
];

const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: "",
        whatsappNo: "",
        purpose: "gov",
        subjects: [],
        type: "practice",
        dailyHours: 1
    });

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const res = await getAllInquiries();
            if (res.success) {
                setInquiries(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch inquiries", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const toggleSubject = (subId) => {
        setForm(prev => {
            const current = [...prev.subjects];
            if (current.includes(subId)) {
                return { ...prev, subjects: current.filter(id => id !== subId) };
            } else {
                if (current.length >= 3) {
                    alert("Maximum 3 subjects allowed");
                    return prev;
                }
                return { ...prev, subjects: [...current, subId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.subjects.length === 0) {
            alert("Please select at least one subject");
            return;
        }
        setSubmitting(true);
        try {
            await createInquiry(form);
            alert("Inquiry saved successfully!");
            setForm({
                name: "",
                whatsappNo: "",
                purpose: "gov",
                subjects: [],
                type: "practice",
                dailyHours: 1
            });
            fetchInquiries();
        } catch (error) {
            alert(error.response?.data?.error || "Failed to save inquiry");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
        try {
            await deleteInquiry(id);
            alert("Inquiry deleted");
            fetchInquiries();
        } catch (error) {
            alert("Failed to delete");
        }
    };

    const calculateFees = () => {
        if (form.type === 'practice') {
            return form.dailyHours * 600;
        } else {
            return form.subjects.length * 6500;
        }
    };

    const totalInquiries = inquiries.length;
    const practiceInquiries = inquiries.filter(i => i.type === 'practice').length;
    const courseInquiries = inquiries.filter(i => i.type === 'course').length;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Student Inquiries</h1>

            {/* Stats
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalInquiries}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Practice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{practiceInquiries}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Full Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{courseInquiries}</div>
                    </CardContent>
                </Card>
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>New Inquiry</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Student Name</Label>
                                <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whatsappNo">WhatsApp No</Label>
                                <Input id="whatsappNo" name="whatsappNo" value={form.whatsappNo} onChange={handleChange} required placeholder="10 Digit Number" maxLength={10} />
                            </div>
                            <div className="space-y-2">
                                <Label>Purpose</Label>
                                <select 
                                    name="purpose" 
                                    value={form.purpose} 
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md text-sm"
                                >
                                    <option value="gov">Government Export</option>
                                    <option value="pvt">Private Job</option>
                                    <option value="skill">Skill Development</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Subjects (Max 3)</Label>
                                <div className="flex flex-wrap gap-2">
                                    {SUBJECTS_LIST.map(sub => (
                                        <button
                                            key={sub.id}
                                            type="button"
                                            onClick={() => toggleSubject(sub.id)}
                                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                                form.subjects.includes(sub.id) 
                                                ? "bg-primary text-primary-foreground border-primary" 
                                                : "bg-background text-muted-foreground border-input"
                                            }`}
                                        >
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Admission Type</Label>
                                <select 
                                    name="type" 
                                    value={form.type} 
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md text-sm"
                                >
                                    <option value="practice">Monthly Practice</option>
                                    <option value="course">Full Course Admission</option>
                                </select>
                            </div>

                            {form.type === 'practice' && (
                                <div className="space-y-2">
                                    <Label htmlFor="dailyHours">Daily Hours</Label>
                                    <Input id="dailyHours" name="dailyHours" type="number" min="1" value={form.dailyHours} onChange={handleChange} />
                                </div>
                            )}

                            <div className="p-3 bg-muted rounded-lg space-y-1">
                                <div className="text-xs text-muted-foreground">Estimated Fee</div>
                                <div className="text-lg font-bold flex items-center">
                                    <IndianRupee className="h-4 w-4 mr-1" />
                                    {calculateFees()}
                                    {form.type === 'practice' ? '/- per month' : '/- total'}
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={submitting}>
                                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                Save Inquiry
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>All Inquiries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Subjects</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10">Loading...</TableCell>
                                    </TableRow>
                                ) : inquiries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No inquiries found</TableCell>
                                    </TableRow>
                                ) : (
                                    inquiries.map((inq) => (
                                        <TableRow key={inq._id}>
                                            <TableCell>
                                                <div className="font-medium">{inq.name}</div>
                                                <div className="text-xs text-muted-foreground capitalize">{inq.type}</div>
                                            </TableCell>
                                            <TableCell>{inq.whatsappNo}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {inq.subjects.map(sub => (
                                                        <Badge key={sub} variant="outline" className="text-[10px] capitalize">
                                                            {sub.replace('_', ' ')}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => generateInquiryPDF(inq)} title="Download Receipt">
                                                        <FileText className="h-4 w-4 text-blue-600" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(inq._id)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Inquiries;

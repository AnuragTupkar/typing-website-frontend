import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { createAdmission, getAllAdmissions, deleteAdmission } from "../api/admissionApi";
import { generateAdmissionPDF } from "../utils/admissionPdfGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Loader2, FileText, Download } from "lucide-react";

const COURSES = [
    { id: 'english_30', label: 'English 30 WPM' },
    { id: 'english_40', label: 'English 40 WPM' },
    { id: 'english_50', label: 'English 50 WPM' },
    { id: 'marathi_30', label: 'Marathi 30 WPM' },
    { id: 'marathi_40', label: 'Marathi 40 WPM' },
    { id: 'hindi_30', label: 'Hindi 30 WPM' },
    { id: 'hindi_40', label: 'Hindi 40 WPM' }
];

const TIME_SLOTS = [
    '10am-11am', '11am-12pm', '4pm-5pm', '5pm-6pm',
    '6pm-7pm', '7pm-8pm', '8pm-9pm', '9pm-10pm'
];

const AdmissionForm = ({ onSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [batchDropdownOpen, setBatchDropdownOpen] = useState(false);
    const [form, setForm] = useState({
        surname: "", firstName: "", fatherName: "", motherName: "",
        mobile: "", parentMobile: "", email: "", address: "",
        schoolName: "", qualification: "",
        adharNo: "", dob: "", handicapped: false,
        grNo: "", admissionDate: new Date().toISOString().split('T')[0],
        batchTime: [],
        selectedCourses: [],
        submittedDocuments: []
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBatchTimeChange = (slot) => {
        setForm(prev => {
            const current = prev.batchTime;
            const updated = current.includes(slot)
                ? current.filter(s => s !== slot)
                : [...current, slot];
            return { ...prev, batchTime: updated };
        });
    };

    const handleCourseChange = (courseId) => {
        setForm(prev => {
            const current = prev.selectedCourses;
            if (!current.includes(courseId) && current.length >= 3) {
                alert('Maximum 3 courses can be selected');
                return prev;
            }
            const updated = current.includes(courseId)
                ? current.filter(c => c !== courseId)
                : [...current, courseId];
            return { ...prev, selectedCourses: updated };
        });
    };

    const handleDocChange = (docId) => {
        setForm(prev => {
            const current = prev.submittedDocuments;
            const updated = current.includes(docId)
                ? current.filter(d => d !== docId)
                : [...current, docId];
            return { ...prev, submittedDocuments: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createAdmission(form);
            alert("Admission confirmed successfully!");
            onSuccess();
            setForm({
                surname: "", firstName: "", fatherName: "", motherName: "",
                mobile: "", parentMobile: "", email: "", address: "",
                schoolName: "", qualification: "",
                adharNo: "", dob: "", handicapped: false,
                grNo: "", admissionDate: new Date().toISOString().split('T')[0],
                batchTime: [],
                selectedCourses: [],
                submittedDocuments: []
            });
        } catch (error) {
            alert(error.response?.data?.error || "Failed to create admission");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal */}
                <div className="space-y-2">
                    <Label>Surname</Label>
                    <Input name="surname" value={form.surname} onChange={handleChange} required placeholder="Surname" />
                </div>
                <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="First Name" />
                </div>
                <div className="space-y-2">
                    <Label>Father/Husband Name</Label>
                    <Input name="fatherName" value={form.fatherName} onChange={handleChange} required placeholder="Father/Husband Name" />
                </div>
                <div className="space-y-2">
                    <Label>Mother Name</Label>
                    <Input name="motherName" value={form.motherName} onChange={handleChange} required placeholder="Mother Name" />
                </div>

                {/* Contact */}
                <div className="space-y-2">
                    <Label>Mobile No (Student)</Label>
                    <Input name="mobile" value={form.mobile} onChange={handleChange} required maxLength={10} placeholder="10 Digit Mobile" />
                </div>
                <div className="space-y-2">
                    <Label>Parent Mobile No</Label>
                    <Input name="parentMobile" value={form.parentMobile} onChange={handleChange} maxLength={10} placeholder="Optional" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>Email ID</Label>
                    <Input name="email" type="email" value={form.email} onChange={handleChange} placeholder="student@example.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <Label>Permanent Address</Label>
                    <Input name="address" value={form.address} onChange={handleChange} required placeholder="Full Address" />
                </div>

                {/* Academic */}
                <div className="space-y-2">
                    <Label>School / College Name</Label>
                    <Input name="schoolName" value={form.schoolName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label>Qualification</Label>
                    <Input name="qualification" value={form.qualification} onChange={handleChange} required />
                </div>

                {/* Identity */}
                <div className="space-y-2">
                    <Label>Adhar Card No</Label>
                    <Input name="adharNo" value={form.adharNo} onChange={handleChange} required maxLength={12} placeholder="12 Digit Adhar" />
                </div>
                <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input name="dob" type="date" value={form.dob} onChange={handleChange} required />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                    <input 
                        type="checkbox" 
                        id="handicapped" 
                        name="handicapped"
                        checked={form.handicapped} 
                        onChange={handleChange}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <Label htmlFor="handicapped">Handicapped?</Label>
                </div>

                {/* Office Use */}
                <div className="space-y-2">
                    <Label>G.R. No (General Register)</Label>
                    <Input name="grNo" value={form.grNo} onChange={handleChange} required placeholder="Unique ID" />
                </div>
                <div className="space-y-2">
                    <Label>Date of Admission</Label>
                    <Input name="admissionDate" type="date" value={form.admissionDate} onChange={handleChange} required />
                </div>
                <div className="space-y-2 relative">
                    <Label>Batch Time(s)</Label>
                    <div
                        className="w-full p-2 border rounded-md text-sm bg-background cursor-pointer flex justify-between items-center"
                        onClick={() => setBatchDropdownOpen(prev => !prev)}
                    >
                        <span className={form.batchTime.length ? "text-foreground" : "text-muted-foreground"}>
                            {form.batchTime.length ? form.batchTime.join(", ") : "Select Batch Time(s)"}
                        </span>
                        <span className="text-muted-foreground text-xs">▼</span>
                    </div>
                    {batchDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {TIME_SLOTS.map(slot => (
                                <label key={slot} className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.batchTime.includes(slot)}
                                        onChange={() => handleBatchTimeChange(slot)}
                                        className="h-4 w-4"
                                    />
                                    {slot}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Courses */}
            <div className="pt-4 border-t">
                <Label className="text-base font-semibold mb-2 block">Select Courses</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {COURSES.map(course => (
                        <div key={course.id} className="flex items-center space-x-2">
                            <input 
                                type="checkbox"
                                id={course.id} 
                                checked={form.selectedCourses.includes(course.id)}
                                onChange={() => handleCourseChange(course.id)}
                                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <Label htmlFor={course.id} className="text-sm font-normal cursor-pointer">{course.label}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Documents */}
            <div className="pt-4 border-t">
                <Label className="text-base font-semibold mb-2 block">Documents Submitted</Label>
                <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                        <input 
                            type="checkbox"
                            id="doc_adhar" 
                            checked={form.submittedDocuments.includes('adhar_card')}
                            onChange={() => handleDocChange('adhar_card')}
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <Label htmlFor="doc_adhar">Adhar Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input 
                            type="checkbox"
                            id="doc_tc" 
                            checked={form.submittedDocuments.includes('tc_lc')}
                            onChange={() => handleDocChange('tc_lc')}
                            className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <Label htmlFor="doc_tc">T.C. / L.C.</Label>
                    </div>
                </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                Confirm Admission
            </Button>
        </form>
    );
};

const Admissions = () => {
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    const fetchAdmissions = async () => {
        try {
            setLoading(true);
            const res = await getAllAdmissions();
            if (res.success) {
                setAdmissions(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch admissions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this admission?")) return;
        try {
            await deleteAdmission(id);
            alert("Admission record removed");
            fetchAdmissions();
        } catch (error) {
            alert("Failed to delete");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Admissions</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-600 hover:bg-red-700">
                            <Plus className="mr-2 h-4 w-4" /> New Admission
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>New Student Admission</DialogTitle>
                        </DialogHeader>
                        <AdmissionForm onSuccess={() => { setOpen(false); fetchAdmissions(); }} />
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Admitted Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>GR No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Mobile</TableHead>
                                <TableHead>Courses</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">Loading...</TableCell>
                                </TableRow>
                            ) : admissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">No admissions yet</TableCell>
                                </TableRow>
                            ) : (
                                admissions.map((adm) => (
                                    <TableRow key={adm._id}>
                                        <TableCell className="font-medium">{adm.grNo}</TableCell>
                                        <TableCell>{adm.firstName} {adm.surname}</TableCell>
                                        <TableCell>{adm.mobile}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {adm.selectedCourses.map(c => (
                                                    <Badge key={c} variant="secondary" className="text-xs">
                                                        {COURSES.find(opt => opt.id === c)?.label || c}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{new Date(adm.admissionDate).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary hover:text-primary hover:bg-primary/10"
                                                    onClick={() => generateAdmissionPDF(adm)}
                                                    title="Download Admission Form"
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(adm._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
    );
};

export default Admissions;

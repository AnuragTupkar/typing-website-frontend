import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { uploadDocument, getAllDocuments, downloadDocument, deleteDocument } from "../api/documentApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, Download, Trash2, FileText, Image, File, 
  Search, Loader2, AlertCircle, Eye
} from "lucide-react";

const getFileIcon = (mimetype) => {
  if (mimetype?.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
  if (mimetype?.includes('image')) return <Image className="h-8 w-8 text-blue-500" />;
  return <File className="h-8 w-8 text-gray-500" />;
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default function Utilities() {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await getAllDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title || selectedFile.name);
      await uploadDocument(formData);
      setTitle("");
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      await downloadDocument(doc._id, doc.originalName);
    } catch (err) {
      alert("Download failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocument(id);
      fetchDocuments();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filteredDocs = documents.filter(d =>
    (d.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.originalName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full bg-background p-6 md:p-10 space-y-8 overflow-y-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Utilities</h1>
        <p className="text-muted-foreground">Upload, manage, and download documents.</p>
      </div>

      {/* Upload Section — Admin Only */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5" /> Upload Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="doc-title">Title (optional)</Label>
                <Input
                  id="doc-title"
                  placeholder="e.g. Student Guidelines"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="file-upload">File (PDF, JPG, PNG, DOC, XLS, TXT — max 10MB)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>
              <Button type="submit" disabled={uploading} className="min-w-[120px]">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </form>
            {error && (
              <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative w-full md:w-[350px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg">No documents found</p>
          {isAdmin && <p className="text-sm">Upload your first document above.</p>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDocs.map((doc) => (
            <Card key={doc._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col gap-3">
                {/* Image thumbnail preview */}
                {doc.mimetype?.startsWith('image/') && (
                  <div className="w-full h-36 rounded-md overflow-hidden bg-muted">
                    <img 
                      src={`http://localhost:3000/uploads/${doc.filename}`} 
                      alt={doc.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start gap-3">
                  {getFileIcon(doc.mimetype)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate" title={doc.title}>{doc.title}</h3>
                    <p className="text-xs text-muted-foreground truncate" title={doc.originalName}>{doc.originalName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">{formatFileSize(doc.size)}</Badge>
                    <Badge variant="outline" className="text-xs">{doc.mimetype?.split('/')[1]?.toUpperCase() || 'FILE'}</Badge>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(doc.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  {doc.uploadedBy && ` • ${doc.uploadedBy.name || doc.uploadedBy.email}`}
                </div>
                <div className="flex gap-2 mt-auto">
                  {(doc.mimetype?.startsWith('image/') || doc.mimetype === 'application/pdf') && (
                    <Button size="sm" variant="outline" onClick={() => window.open(`http://localhost:3000/uploads/${doc.filename}`, '_blank')}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => handleDownload(doc)}>
                    <Download className="h-3.5 w-3.5 mr-1" /> Download
                  </Button>
                  {isAdmin && (
                    <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(doc._id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
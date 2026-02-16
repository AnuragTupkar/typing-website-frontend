import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Users, Clock, MapPin, Phone, Mail } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-full bg-background text-foreground pt-10 pb-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Section */}
        <section className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Badge variant="outline" className="px-4 py-1 text-sm border-primary/50 text-primary uppercase tracking-wider">
            Established 1969
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Pratibha Typing Institute
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Over 50 years of excellence in shaping careers through professional typing and shorthand education.
          </p>
        </section>

        {/* Hero Image / Banner Placeholder */}
        <div className="w-full h-64 md:h-80 bg-muted rounded-2xl flex items-center justify-center overflow-hidden border border-border shadow-sm">
           <div className="text-center opacity-50">
             <BookOpen className="w-16 h-16 mx-auto mb-2" />
             <p>Institute Building / Classroom Image</p>
           </div>
        </div>

        {/* Mission & History */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Our History</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 1969, Pratibha Typing Institute has been a pioneer in commercial education. For over five decades, we have dedicated ourselves to providing high-quality training in Typewriting and Shorthand, evolving from manual typewriters to modern computer-based systems.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary shadow-sm hover:shadow-md transition-shadow">
             <CardContent className="pt-6 space-y-4">
               <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Award className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h2 className="text-2xl font-semibold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To empower students with the essential technical skills required for government examinations and corporate careers. We believe in discipline, accuracy, and consistent practice as the pillars of success.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats / Values */}
        <section className="bg-muted/30 rounded-2xl p-8 md:p-12 border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             <div className="space-y-2">
               <div className="text-4xl font-bold text-primary">50+</div>
               <div className="text-sm font-medium text-muted-foreground">Years of Experience</div>
             </div>
             <div className="space-y-2">
               <div className="text-4xl font-bold text-primary">10k+</div>
               <div className="text-sm font-medium text-muted-foreground">Students Trained</div>
             </div>
             <div className="space-y-2">
               <div className="text-4xl font-bold text-primary">100%</div>
               <div className="text-sm font-medium text-muted-foreground">Dedication</div>
             </div>
             <div className="space-y-2">
               <div className="text-4xl font-bold text-primary">Govt</div>
               <div className="text-sm font-medium text-muted-foreground">Exam Focused</div>
             </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="grid md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start p-4 rounded-xl hover:bg-muted/50 transition-colors">
            <MapPin className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Our Location</h3>
            <p className="text-sm text-muted-foreground">Main Market, City Center,<br/>New Delhi, India</p>
          </div>
          <div className="flex flex-col items-center md:items-start p-4 rounded-xl hover:bg-muted/50 transition-colors">
            <Phone className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Contact Us</h3>
            <p className="text-sm text-muted-foreground">+91 98765 43210<br/>011-23456789</p>
          </div>
          <div className="flex flex-col items-center md:items-start p-4 rounded-xl hover:bg-muted/50 transition-colors">
            <Mail className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-sm text-muted-foreground">info@pratibhainstitute.com<br/>admissions@pratibha.com</p>
          </div>
        </section>

      </div>
    </div>
  );
}

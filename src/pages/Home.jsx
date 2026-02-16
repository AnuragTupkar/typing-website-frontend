import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Keyboard, Trophy, Briefcase, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="h-full bg-background text-foreground overflow-y-auto">
      
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 flex flex-col items-center justify-center text-center bg-gradient-to-b from-primary/5 to-background">
        <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm uppercase tracking-widest font-semibold text-primary">
          Excellence Since 1969
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
          <span className="text-primary">Pratibha</span> Typing Institute
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          The premier destination for professional typing and shorthand education. 
          Shaping careers for government and private sectors for over 50 years.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link to="/register">
            <Button size="lg" className="px-8 py-6 text-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg w-full sm:w-auto">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats/Legacy Bar */}
      <section className="border-y border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
           <div>
             <div className="text-3xl font-bold">1969</div>
             <div className="text-sm text-muted-foreground">Established</div>
           </div>
           <div>
             <div className="text-3xl font-bold">10k+</div>
             <div className="text-sm text-muted-foreground">Certified Students</div>
           </div>
           <div>
             <div className="text-3xl font-bold">Govt.</div>
             <div className="text-sm text-muted-foreground">Exam Preparation</div>
           </div>
           <div>
             <div className="text-3xl font-bold">Expert</div>
             <div className="text-sm text-muted-foreground">Faculty Guidance</div>
           </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 bg-background">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Pratibha?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We don't just teach typing; we build careers. Our disciplined approach has helped thousands 
            secure positions in SSC, Banking, Railways, and more.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-card border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <CardHeader>
              <Briefcase className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Job-Oriented Training</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Specialized curriculum designed for SSC CHSL, CGL, Steno, and other competitive exams.
            </CardContent>
          </Card>
          
          <Card className="bg-card border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <CardHeader>
              <Keyboard className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Modern & Manual</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Master both classic typewriter techniques and modern computer keyboard proficiency.
            </CardContent>
          </Card>
          
          <Card className="bg-card border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <CardHeader>
              <Trophy className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-xl">Certification</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Earn recognized certificates that add value to your resume and validate your skills.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer Call to Action */}
      <section className="py-24 px-4 bg-muted/30 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Boost Your Speed?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
          Join the legacy of learners who have transformed their careers with Pratibha Typing Institute.
        </p>
        <Link to="/register">
           <Button size="lg" className="px-10 py-6 text-lg">
             Enroll Now
           </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Pratibha Typing Institute. All rights reserved.
      </footer>
    </div>
  )
}
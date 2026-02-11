// pages/Home.jsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F1F5F9]">
      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Master Typing with Focus
        </h1>
        <p className="text-xl md:text-2xl text-[#CBD5E1] max-w-3xl mb-10">
          Daily practice with real metrics, clean progress tracking, and zero distractions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="text-lg px-10 py-6 bg-[#6366F1] hover:bg-[#818CF8]">
            Start Practicing Now
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10">
            See How It Works
          </Button>
        </div>
      </section>

      {/* Value pillars */}
      <section className="py-20 px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-[#1E293B] border-none hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Real-time Feedback</CardTitle>
            </CardHeader>
            <CardContent className="text-[#CBD5E1]">
              Instant WPM, accuracy, error patterns — know exactly what to fix.
            </CardContent>
          </Card>
          {/* two more cards... */}
        </div>
      </section>

      {/* more sections... */}
    </div>
  )
}
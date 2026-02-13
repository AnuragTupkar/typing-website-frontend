import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { Activity, Trophy, Target, Clock, TrendingUp, AlertTriangle, Hash, CalendarCheck, Loader2, Timer, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { getMyStats, getMyHistory } from '../api/practiceApi';
import { sendHeartbeat, getTodayAttendance, getAttendanceSummary } from '../api/attendanceApi';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const heartbeatIntervalRef = useRef(null);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, historyRes, todayRes, summaryRes] = await Promise.all([
          getMyStats(),
          getMyHistory(1, 15),
          getTodayAttendance(),
          getAttendanceSummary(),
        ]);

        setStats(statsRes.data);
        setHistory(historyRes.data || []);
        setTodayAttendance(todayRes.data);
        setAttendanceSummary(summaryRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Heartbeat: send every 2 minutes to track active time
  useEffect(() => {
    const doHeartbeat = async () => {
      try {
        await sendHeartbeat();
        // Refresh today's attendance after each heartbeat
        const todayRes = await getTodayAttendance();
        setTodayAttendance(todayRes.data);
      } catch (err) {
        console.error('Heartbeat error:', err);
      }
    };

    // Send initial heartbeat
    doHeartbeat();

    // Then every 2 minutes
    heartbeatIntervalRef.current = setInterval(doHeartbeat, 2 * 60 * 1000);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, []);

  // Transform history for chart (reverse so earliest is first)
  const chartData = [...history].reverse().map((session, index) => ({
    session: `#${index + 1}`,
    wpm: session.wpm,
    accuracy: session.accuracy,
  }));

  // Recent activity (most recent first)
  const recentActivity = history.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background gap-4">
        <AlertTriangle className="w-10 h-10 text-destructive" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const statCards = [
    { label: "Average WPM", value: stats?.avgWpm ?? 0, icon: Activity, color: "text-blue-500" },
    { label: "Best WPM", value: stats?.bestWpm ?? 0, icon: Trophy, color: "text-yellow-500" },
    { label: "Avg Accuracy", value: `${stats?.avgAccuracy ?? 0}%`, icon: Target, color: "text-green-500" },
    { label: "Time Typed", value: `${stats?.totalHours ?? 0}h`, icon: Clock, color: "text-purple-500" },
    { label: "Total Sessions", value: stats?.totalSessions ?? 0, icon: Hash, color: "text-indigo-500" },
    { label: "Avg Errors", value: stats?.avgErrors ?? 0, icon: AlertTriangle, color: "text-red-500" },
  ];

  // Attendance helpers
  const isOngoing = todayAttendance?.status === 'ongoing';
  const isPresent = todayAttendance?.status === 'present';
  const isSunday = todayAttendance?.status === 'sunday';
  const minutesDone = todayAttendance?.totalMinutes ?? 0;
  const minutesLeft = todayAttendance?.minutesLeft ?? 40;
  const requiredMinutes = todayAttendance?.requiredMinutes ?? 40;
  const progressPercent = Math.min(100, (minutesDone / requiredMinutes) * 100);

  return (
    <div className="h-full bg-background p-6 md:p-10 space-y-8 overflow-y-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Welcome back, {user?.name || 'Student'}
        </h1>
        <p className="text-muted-foreground text-lg">
          Here's a look at your typing progress.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-5 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - WPM Progress */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              WPM Progress
            </h3>
          </div>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="session" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-foreground)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="var(--color-primary)" 
                    fillOpacity={1} 
                    fill="url(#colorWpm)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No practice sessions yet. Start practicing to see your progress!
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity List */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.4 }}
           className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-auto space-y-3 pr-1">
            {recentActivity.length > 0 ? recentActivity.map((session) => (
              <div key={session._id} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg hover:bg-muted/60 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{session.wpm} WPM</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-primary">{session.accuracy}%</span>
                  <div className="text-xs text-muted-foreground">{session.duration}s</div>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No sessions yet.</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Attendance Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-green-500" />
          Attendance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Status */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Today</h4>
            
            {isSunday ? (
              <div className="p-4 bg-muted/40 rounded-lg text-center">
                <p className="text-lg font-semibold text-muted-foreground">🌤️ It's Sunday!</p>
                <p className="text-sm text-muted-foreground mt-1">No attendance tracked on Sundays.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status Badge */}
                <div className="flex items-center gap-3">
                  {isPresent ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-800 dark:text-green-400">Present</span>
                    </div>
                  ) : isOngoing ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                      <Timer className="w-4 h-4 text-yellow-600 dark:text-yellow-400 animate-pulse" />
                      <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Ongoing</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full">
                      <Timer className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-muted-foreground">Not Started</span>
                    </div>
                  )}
                  
                  {!isPresent && !isSunday && (
                    <span className="text-sm text-muted-foreground">
                      {minutesLeft > 0 
                        ? `${Math.round(minutesLeft)} min left`
                        : 'Marking present...'
                      }
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(minutesDone)} min done</span>
                    <span>{requiredMinutes} min required</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${isPresent ? 'bg-green-500' : 'bg-yellow-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overview</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-sm text-green-800 dark:text-green-400 font-medium">Present</span>
                <span className="text-lg font-bold text-green-800 dark:text-green-400">
                  {attendanceSummary?.presentDays ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="text-sm text-red-800 dark:text-red-400 font-medium">Absent</span>
                <span className="text-lg font-bold text-red-800 dark:text-red-400">
                  {attendanceSummary?.absentDays ?? 0}
                </span>
              </div>
            
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

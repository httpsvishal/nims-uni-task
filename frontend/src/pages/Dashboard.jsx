

import { Users, UserPlus, BookOpen, TrendingUp } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Layout from "../components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { studentsAPI } from "../lib/api"

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState([
    {
      title: "Total Students",
      value: "0",
      description: "Enrolled students",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      loading: true,
    },
    {
      title: "New Admissions",
      value: "0",
      description: "This semester",
      icon: UserPlus,
      color: "text-accent",
      bgColor: "bg-accent/10",
      loading: true,
    },
    {
      title: "Active Courses",
      value: "0",
      description: "Ongoing programs",
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
      loading: true,
    },
    {
      title: "Graduation Rate",
      value: "0%",
      description: "Last academic year",
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
      loading: true,
    },
  ])

  useEffect(() => {
    loadDashboardStats()
  }, [])


  const loadDashboardStats = async () => {
    try {
      // Load total students count
      const totalResponse = await studentsAPI.getAll({ page: 1, limit: 1 })
      const totalCount = totalResponse.total || (Array.isArray(totalResponse) ? totalResponse.length : 0)
      
      // If no data available (empty backend), show zeros
      if (totalCount === 0) {
        setStats([
          {
            title: "Total Students",
            value: "0",
            description: "Enrolled students",
            icon: Users,
            color: "text-primary",
            bgColor: "bg-primary/10",
            loading: false,
          },
          {
            title: "New Admissions",
            value: "0",
            description: "Last 30 days",
            icon: UserPlus,
            color: "text-accent",
            bgColor: "bg-accent/10",
            loading: false,
          },
          {
            title: "Active Courses",
            value: "0",
            description: "Ongoing programs",
            icon: BookOpen,
            color: "text-primary",
            bgColor: "bg-primary/10",
            loading: false,
          },
          {
            title: "Graduation Rate",
            value: "0%",
            description: "Last academic year",
            icon: TrendingUp,
            color: "text-accent",
            bgColor: "bg-accent/10",
            loading: false,
          },
        ])
        return
      }
      
      // Load recent students for new admissions (last 30 days) only if we have data
      const recentResponse = await studentsAPI.getAll({ page: 1, limit: 1000 })
      const allStudents = Array.isArray(recentResponse) ? recentResponse : recentResponse.data || []
      
      // Calculate new admissions (students added in last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const newAdmissions = allStudents.filter(student => {
        const createdAt = student.createdAt || student.dateJoined || student.enrollmentDate
        if (createdAt) {
          return new Date(createdAt) > thirtyDaysAgo
        }
        return false
      }).length

      setStats([
        {
          title: "Total Students",
          value: totalCount.toLocaleString(),
          description: "Enrolled students",
          icon: Users,
          color: "text-primary",
          bgColor: "bg-primary/10",
          loading: false,
        },
        {
          title: "New Admissions",
          value: newAdmissions.toString(),
          description: "Last 30 days",
          icon: UserPlus,
          color: "text-accent",
          bgColor: "bg-accent/10",
          loading: false,
        },
        {
          title: "Active Courses",
          value: "0",
          description: "Ongoing programs",
          icon: BookOpen,
          color: "text-primary",
          bgColor: "bg-primary/10",
          loading: false,
        },
        {
          title: "Graduation Rate",
          value: "0%",
          description: "Last academic year",
          icon: TrendingUp,
          color: "text-accent",
          bgColor: "bg-accent/10",
          loading: false,
        },
      ])
    } catch (error) {
      console.error("Error loading dashboard stats:", error)
      // Set empty state on error instead of showing toast
      setStats([
        {
          title: "Total Students",
          value: "0",
          description: "Enrolled students",
          icon: Users,
          color: "text-primary",
          bgColor: "bg-primary/10",
          loading: false,
        },
        {
          title: "New Admissions",
          value: "0",
          description: "Last 30 days",
          icon: UserPlus,
          color: "text-accent",
          bgColor: "bg-accent/10",
          loading: false,
        },
        {
          title: "Active Courses",
          value: "0",
          description: "Ongoing programs",
          icon: BookOpen,
          color: "text-primary",
          bgColor: "bg-primary/10",
          loading: false,
        },
        {
          title: "Graduation Rate",
          value: "0%",
          description: "Last academic year",
          icon: TrendingUp,
          color: "text-accent",
          bgColor: "bg-accent/10",
          loading: false,
        },
      ])
    }
  }


  const recentActivities = []

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to NIMS University Student Management System</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates from the system</CardDescription>
            </CardHeader>

            <CardContent>
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent activities</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0 border-border"
                    >
                      <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.student}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <button 
                onClick={() => navigate('/students/new')}
                className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <p className="font-medium text-foreground">Add New Student</p>
                <p className="text-sm text-muted-foreground">Enroll a new student</p>
              </button>
              <button 
                onClick={() => navigate('/students')}
                className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <p className="font-medium text-foreground">View All Students</p>
                <p className="text-sm text-muted-foreground">Browse student records</p>
              </button>
              <button 
                onClick={() => navigate('/reports')}
                className="w-full text-left px-4 py-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                <p className="font-medium text-foreground">Generate Reports</p>
                <p className="text-sm text-muted-foreground">Create academic reports</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

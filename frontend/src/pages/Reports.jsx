import { Download, FileText, Users, Calendar } from "lucide-react"
import Layout from "../components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import Button from "../components/ui/Button"

export default function Reports() {
  const reportTypes = [
    {
      title: "Student Enrollment Report",
      description: "Detailed report of all enrolled students",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Academic Performance Report",
      description: "Student grades and academic progress",
      icon: FileText,
      color: "text-green-600", 
      bgColor: "bg-green-100",
    },
    {
      title: "Attendance Report",
      description: "Student attendance tracking and summary",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]


  const recentReports = []

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
          <p className="text-muted-foreground">Generate and download academic reports</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reportTypes.map((report) => {
            const Icon = report.icon
            return (
              <Card key={report.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${report.bgColor}`}>
                      <Icon className={`h-5 w-5 ${report.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription>{report.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Previously generated reports</CardDescription>
          </CardHeader>

          <CardContent>
            {recentReports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reports available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{report.name}</p>
                        <p className="text-sm text-muted-foreground">{report.date} • {report.size}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Builder</CardTitle>
            <CardDescription>Create custom reports with specific filters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Report Type</label>
                <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                  <option>Student List</option>
                  <option>Academic Performance</option>
                  <option>Attendance Summary</option>
                  <option>Custom Query</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Date Range</label>
                <select className="w-full p-2 border border-border rounded-md bg-background text-foreground">
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>Academic year</option>
                </select>
              </div>
            </div>
            <Button className="w-full md:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              Build Custom Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

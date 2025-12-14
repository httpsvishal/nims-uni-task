"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { studentsAPI } from "@/lib/api"

interface StudentFormProps {
  student?: any
}

export default function StudentForm({ student }: StudentFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    course: "",
    enrollmentDate: "",
    status: "Active",
    address: "",
  })
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    if (student) {
      setFormData(student)
    }
  }, [student])


  // Validation function matching DTO rules
  const validateForm = () => {
    const errors = []

    // fullName validation - required, string
    if (!formData.fullName || formData.fullName.trim().length === 0) {
      errors.push("Full name is required")
    }

    // email validation - required, valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.push("Valid email is required")
    }

    // phoneNumber validation - required, string, 10-15 characters
    if (!formData.phoneNumber || formData.phoneNumber.length < 10 || formData.phoneNumber.length > 15) {
      errors.push("Phone number must be between 10 and 15 characters")
    }

    // course validation - required, string
    if (!formData.course || formData.course.trim().length === 0) {
      errors.push("Course is required")
    }

    // enrollmentDate validation - required, valid date
    if (!formData.enrollmentDate) {
      errors.push("Enrollment date is required")
    } else {
      const date = new Date(formData.enrollmentDate)
      if (isNaN(date.getTime())) {
        errors.push("Valid enrollment date is required")
      }
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form data
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0]) // Show first error
        setIsLoading(false)
        return
      }

      if (student) {
        await studentsAPI.update(student.id, formData)
        toast.success("Student updated successfully")
      } else {
        await studentsAPI.create(formData)
        toast.success("Student added successfully")
      }
      router.push("/students")
    } catch (error: any) {
      toast.error(error.message || "Failed to save student")
      console.error("[v0] Error saving student:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="course">Course *</Label>
              <Select value={formData.course} onValueChange={(value) => setFormData({ ...formData, course: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Business Administration">Business Administration</SelectItem>
                  <SelectItem value="Medicine">Medicine</SelectItem>
                  <SelectItem value="Law">Law</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
              <Input
                id="enrollmentDate"
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Graduated">Graduated</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => router.push("/students")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : student ? "Update Student" : "Add Student"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

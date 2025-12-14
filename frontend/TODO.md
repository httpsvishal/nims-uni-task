 
# Student DTO and Add Student Functionality Plan

## Goal:
Update frontend to send data in the exact format of the backend CreateStudentDto:
```typescript
{
  fullName: string;
  email: string;
  phoneNumber: string;
  course: string;
  enrollmentDate: string;
  status?: string;
  address?: string;
}
```

## Issues Identified:
1. Form currently uses `firstName` + `lastName` but DTO expects `fullName`
2. Form uses `phone` but DTO expects `phoneNumber`
3. Form uses `dateOfBirth` but DTO expects `enrollmentDate`
4. Need to transform form data to match DTO structure before sending to API
5. Need frontend validation to match DTO rules

## Plan:
1. Update student form to collect data matching DTO structure
2. Add frontend validation using class-validator rules
3. Transform and send data in DTO format to API
4. Test the functionality






## Steps:
- [x] 1. Update student-form.tsx to use DTO field names and validation
- [x] 2. Add frontend validation matching DTO rules
- [x] 3. Update API calls to use the new format
- [x] 4. Update correct form (StudentForm.jsx) to match DTO structure
- [x] 5. Update StudentList.jsx to display new field names
- [x] 6. Test add student functionality
- [x] 7. Verify validation works correctly

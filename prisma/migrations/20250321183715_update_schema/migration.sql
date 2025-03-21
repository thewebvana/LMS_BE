-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PRINCIPAL', 'ADMIN', 'TEACHER', 'STUDENT', 'PARENTS');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "gender" "Gender",
    "address" TEXT,
    "password" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Principal" (
    "user_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "joining_date" TIMESTAMP(3),
    "designation" TEXT,
    "qualification" TEXT,
    "work_experience" TEXT,

    CONSTRAINT "Principal_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "user_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "joining_date" TIMESTAMP(3),
    "designation" TEXT,
    "qualification" TEXT,
    "work_experience" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "user_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "joining_date" TIMESTAMP(3),
    "designation" TEXT,
    "qualification" TEXT,
    "work_experience" TEXT,
    "class_assigned" TEXT,
    "subjects_taught" TEXT,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Student" (
    "user_id" TEXT NOT NULL,
    "student_id" TEXT,
    "enrollment_number" TEXT,
    "joining_date" TIMESTAMP(3),
    "class_section" TEXT,
    "admission_date" TIMESTAMP(3),
    "blood_group" TEXT,
    "parents_name" TEXT,
    "emergency_contact" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Principal_employee_id_key" ON "Principal"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_employee_id_key" ON "Admin"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_employee_id_key" ON "Teacher"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_student_id_key" ON "Student"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Student_enrollment_number_key" ON "Student"("enrollment_number");

-- AddForeignKey
ALTER TABLE "Principal" ADD CONSTRAINT "Principal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

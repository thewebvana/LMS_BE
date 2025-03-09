const { Principal, Admin, Teacher, Student } = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// 🔹 Function to generate a random password
const generatePassword = () => {
    return crypto.randomBytes(6).toString("hex"); // Generates a 12-character random password
};

// 🔹 Function to send password via email
const sendPasswordEmail = async (email, password, role) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "thewebvana@gmail.com",
                pass: "bzbs yzyc bppv egmd",
            },
        });

        const mailOptions = {
            from: "thewebvana@gmail.com",
            to: email,
            subject: `${role} Account Credentials`,
            text: `Your account has been created as a ${role}. Your temporary password is: ${password}`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// ✅ Register Principal (Password comes from frontend)
exports.createPrincipal = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (await Principal.findOne({ where: { email } })) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const principal = await Principal.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: "Principal created successfully", principal });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Create Admin (Auto-generate password & send email)
exports.createAdmin = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (await Admin.findOne({ where: { email } })) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const generatedPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        const admin = await Admin.create({ name, email, password: hashedPassword });

        await sendPasswordEmail(email, generatedPassword, "Admin");

        res.status(201).json({ message: "Admin created successfully. Password sent via email.", admin });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Create Teacher (Auto-generate password & send email)
exports.createTeacher = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (await Teacher.findOne({ where: { email } })) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const generatedPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        const teacher = await Teacher.create({ name, email, password: hashedPassword });

        await sendPasswordEmail(email, generatedPassword, "Teacher");

        res.status(201).json({ message: "Teacher created successfully. Password sent via email.", teacher });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Create Student (Auto-generate password & send email)
exports.createStudent = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (await Student.findOne({ where: { email } })) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const generatedPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);
        const student = await Student.create({ name, email, password: hashedPassword });

        await sendPasswordEmail(email, generatedPassword, "Student");

        res.status(201).json({ message: "Student created successfully. Password sent via email.", student });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

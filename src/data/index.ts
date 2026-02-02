import { Github, Linkedin, Mail, Code, Cpu, Database, Zap, Code2, Server, Settings, BarChart3 } from 'lucide-react';

export const personalInfo = {
    name: "Kshitij Singh",
    title: "Full Stack Developer",
    description: "Building scalable web applications and exploring the world of machine learning. Passionate about clean code, data-driven solutions, and elegant architecture.",
    email: "kshitij.tech06@gmail.com",
    location: "Bengaluru, Karnataka",
    resume: "/resume.pdf"
};

export const socialLinks = [
    { href: 'https://github.com/kshitij-singh06', Icon: Github, label: "GitHub" },
    { href: 'https://www.linkedin.com/in/kshitij-singh-98068a34a/', Icon: Linkedin, label: "LinkedIn" },
    { href: 'mailto:kshitij.tech06@gmail.com', Icon: Mail, label: "Email" },
];

export const skillCategories = [
    {
        title: 'Languages',
        icon: Code2,
        skills: ['Python', 'C++', 'JavaScript', 'SQL', 'R'],
    },
    {
        title: 'Machine Learning',
        icon: Cpu,
        skills: ['TensorFlow', 'Keras', 'PyTorch', 'scikit-learn', 'XGBoost', 'LightGBM', 'SHAP', 'Optuna'],
    },
    {
        title: 'Deep Learning',
        icon: Zap,
        skills: ['CNNs', 'Transfer Learning', 'Model Optimization', 'Computer Vision', 'NLP'],
    },
    {
        title: 'Data Science',
        icon: BarChart3,
        skills: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Feature Engineering', 'A/B Testing'],
    },
    {
        title: 'MLOps & Deployment',
        icon: Server,
        skills: ['Streamlit', 'FastAPI', 'Docker', 'Model Versioning', 'REST APIs'],
    },
    {
        title: 'Frameworks & Tools',
        icon: Settings,
        skills: ['React', 'Node.js', 'Express', 'Git', 'Linux', 'AWS'],
    },
    {
        title: 'Databases',
        icon: Database,
        skills: ['PostgreSQL', 'MongoDB', 'MySQL'],
    },
];

export const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
];

export const projects = [
    {
        title: 'Visual language translation engine',
        description:
            'It is an automated scanlation tool that streamlines manga translation using Computer Vision and NLP for text detection, inpainting, translation, and typesetting. It reduces release time while maintaining high accuracy and accessibility for global readers.',

        tags: [
            "Python",
            "OpenCV",
            "PyTorch",
            "PaddleOCR / Tesseract OCR",
            "Pillow (PIL)", " NumPy",
            "Google / DeepL / OpenAI APIs"
        ],
        github: 'https://github.com/kshitij-singh06/Manga-Translator',
        featured: true
    },
    {
        title: 'Customer Intelligence System',
        description:
            'A production-ready machine learning system that predicts Customer Lifetime Value (CLV) and churn probability using transactional data. It combines regression, classification, and strategic segmentation to drive data-driven customer retention and revenue growth decisions.',

        tags: [
            "Python",
            "Pandas & NumPy",
            "scikit-learn",
            "XGBoost & LightGBM",
            "SHAP & Optuna",
            "Streamlit",
        ],
        github: 'https://github.com/kshitij-singh06/Customer-Intelligence-System',
        liveDemo: 'https://customer-intelligence-system.streamlit.app',
        featured: true
    },
    {
        title: 'Full-Stack E-Commerce Platform',
        description:
            'A comprehensive e-commerce application with Node.js, Express, PostgreSQL, and Prisma ORM. Features JWT authentication, role-based authorization, product CRUD, dynamic cart updates, and admin dashboard with Multer image uploads.',
        tags: ['Node.js', 'Express', 'PostgreSQL', 'React', 'Prisma'],
        github: 'https://github.com/kshitij-singh06/E-commerce',
        featured: true
    },

    {
        title: 'Handwritten Digit Recognition',
        description:
            'CNN model trained on MNIST dataset achieving 99.5% accuracy with data augmentation and early stopping. Features interactive Streamlit web app with drawable canvas for real-time predictions and confidence scores.',
        tags: ['Python', 'TensorFlow', 'Keras', 'Streamlit', 'CNN'],
        github: 'https://github.com/kshitij-singh06/handwritten-digit-predictor',
        liveDemo: 'https://kshitij-singh06-digit-predictor-app-j62rol.streamlit.app/',
        featured: true
    },
    {
        title: 'Secure Data Wiping & Verification System',
        description:
            'Cross-platform desktop app using Python and Tkinter for secure drive erasure with DoD-compliant multi-pass algorithms and cryptographic certificates. Includes React/Node.js web portal with Supabase authentication.',
        tags: ['Python', 'React', 'Node.js', 'Supabase', 'Tkinter'],
        github: 'https://github.com/kshitij-singh06/Secure-wipe',
        liveDemo: 'https://secure-wipe.pages.dev/',
        featured: true
    },
    {
        title: 'URL Shortener',
        description:
            'REST API for short link creation, redirect, and analytics with JWT-based authentication and middleware-protected routes. Built with Node.js, Express 5, MongoDB, and EJS templating.',
        tags: ['Node.js', 'Express', 'MongoDB', 'JWT', 'EJS'],
        github: 'https://github.com/kshitij-singh06/short-url',
        featured: false
    },
];

export const floatingIcons = [
    { Icon: Code, top: '15%', left: '10%', delay: 0, size: 24 },
    { Icon: Cpu, top: '25%', right: '15%', delay: 1, size: 28 },
    { Icon: Database, bottom: '30%', left: '8%', delay: 2, size: 22 },
    { Icon: Zap, top: '60%', right: '10%', delay: 1.5, size: 26 },
    { Icon: Code, bottom: '20%', right: '20%', delay: 0.5, size: 20 },
    { Icon: Cpu, top: '40%', left: '5%', delay: 2.5, size: 24 },
];

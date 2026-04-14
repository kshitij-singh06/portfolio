import { Github, Linkedin, Mail, Code, Cpu, Database, Server, Settings, Code2, BarChart3, GitBranch, Cloud, Terminal, Atom } from 'lucide-react';

export const personalInfo = {
    name: "Kshitij Singh",
    title: "Full Stack Developer",
    description: "Building scalable web applications and exploring the world of machine learning. Passionate about clean code, data-driven solutions, and elegant architecture.",
    email: "kshitij.tech06@gmail.com",
    location: "Bengaluru, Karnataka",
    resume: "https://ubhgkplrqnklhwucilmu.supabase.co/storage/v1/object/public/portfolio-asset/kshitij_resume.pdf"
};

export const socialLinks = [
    { href: 'https://github.com/kshitij-singh06', Icon: Github, label: "GitHub" },
    { href: 'https://www.linkedin.com/in/kshitij-singh-98068a34a/', Icon: Linkedin, label: "LinkedIn" },
    { href: 'mailto:kshitij.tech06@gmail.com', Icon: Mail, label: "Email" },
];

export const skillDomains = [
    {
        domain: 'Development',
        categories: [
            { title: 'Languages', icon: Code2, skills: ['Python', 'C++', 'JavaScript', 'TypeScript', 'SQL'] },
            { title: 'Frontend', icon: Code, skills: ['React', 'Tailwind CSS', 'HTML', 'CSS', 'Figma'] },
            { title: 'Backend', icon: Server, skills: ['Node.js', 'Express', 'FastAPI', 'Postman'] },
            { title: 'Databases', icon: Database, skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'Supabase', 'Prisma'] },
        ],
    },
    {
        domain: 'AI & Data Science',
        categories: [
            { title: 'Machine Learning', icon: Cpu, skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'XGBoost', 'Pandas', 'NumPy'] },
            { title: 'Data Science', icon: BarChart3, skills: ['R', 'Matplotlib', 'Seaborn', 'Power BI', 'Tableau', 'Airflow', 'dbt', 'Snowflake'] },
        ],
    },
    {
        domain: 'Security & Infrastructure',
        categories: [
            { title: 'Tools & Platforms', icon: Settings, skills: ['Git', 'Docker', 'Linux', 'AWS'] },
        ],
    },
];

export const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Skills', id: 'skills' },
    { label: 'Contact', id: 'contact' },
];

export const projects = [
    {
        title: 'IntelX – Cybersecurity Intelligence Platform',
        shortDescription: 'Unified OSINT platform with 5 integrated security tools for rapid attack surface discovery.',
        description:
            'Unified OSINT platform with 5 integrated security tools — Web Analysis, Malware Forensics, Recon, Steganography Detection, and URL Tracing — for rapid attack surface discovery. Features a Dockerized Python REST API backend integrating VirusTotal, DNS lookups, and breach data analysis, with a responsive React frontend built using Tailwind CSS, Framer Motion animations, and glassmorphism UI.',
        tags: ['React', 'Python', 'Docker', 'Tailwind CSS', 'Vite', 'Framer Motion'],
        github: 'https://github.com/kshitij-singh06/intelx-frontend',
        featured: true,
        liveDemo: 'https://intelx1337.vercel.app/',
        image: '/intelx.png'
    },
    {
        title: 'NetScope – Deep Packet Inspection',
        shortDescription: 'High-performance multi-threaded C++ engine for capturing and analyzing live network traffic.',
        description:
            'Developed a high-performance multi-threaded packet inspection engine in C++ to capture and analyze live network traffic and large PCAP traffic streams, extracting application layer signals such as TLS SNI, HTTP host metadata, and DNS query patterns. Designed a scalable flow-aware processing architecture using load-balanced worker threads and thread-safe queues.',
        tags: ['C++', 'JavaScript', 'Multithreading', 'Network Security'],
        github: 'https://github.com/kshitij-singh06/NetScope',
        liveDemo: 'https://kshitij-singh06.github.io/NetScope',
        featured: false,
        image: 'https://placehold.co/800x450/0f172a/38bdf8?text=NetScope'
    },
    {
        title: 'Full-Stack E-Commerce Platform',
        shortDescription: 'Comprehensive e-commerce application with dynamic cart, roles, and admin dashboard.',
        description:
            'A comprehensive e-commerce application with Node.js, Express, PostgreSQL, and Prisma ORM. Features JWT authentication, role-based authorization, product CRUD, dynamic cart updates, and admin dashboard with Multer image uploads.',
        tags: ['Node.js', 'Express', 'PostgreSQL', 'React', 'Prisma'],
        github: 'https://github.com/kshitij-singh06/E-commerce',
        liveDemo: 'https://e-commerce-woad-tau.vercel.app/',
        featured: false,
        image: 'https://placehold.co/800x450/0f172a/818cf8?text=E-Commerce'
    },
    {
        title: 'Secure Data Wiping & Verification System',
        shortDescription: 'Cross-platform desktop app for secure, DoD-compliant hard drive erasure.',
        description:
            'Cross-platform desktop app using Python and Tkinter for secure drive erasure with DoD-compliant multi-pass algorithms and cryptographic certificates. Includes React/Node.js web portal with Supabase authentication.',
        tags: ['Python', 'React', 'Node.js', 'Supabase', 'Tkinter'],
        github: 'https://github.com/kshitij-singh06/Secure-wipe',
        liveDemo: 'https://secure-wipe.pages.dev/',
        featured: false,
        image: 'https://placehold.co/800x450/0f172a/a78bfa?text=SecureWipe'
    },


    {
        title: 'Customer Intelligence System',
        shortDescription: 'ML system predicting Customer Lifetime Value and churn using transactional data.',
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
        featured: false,
        image: 'https://placehold.co/800x450/0f172a/c084fc?text=Customer+Intel'
    },

    {
        title: 'Handwritten Digit Recognition',
        shortDescription: 'CNN model on MNIST achieving 99.5% accuracy with an interactive drawing canvas app.',
        description:
            'CNN model trained on MNIST dataset achieving 99.5% accuracy with data augmentation and early stopping. Features interactive Streamlit web app with drawable canvas for real-time predictions and confidence scores.',
        tags: ['Python', 'TensorFlow', 'Keras', 'Streamlit', 'CNN'],
        github: 'https://github.com/kshitij-singh06/handwritten-digit-predictor',
        liveDemo: 'https://kshitij-singh06-digit-predictor-app-j62rol.streamlit.app/',
        featured: false,
        image: 'https://placehold.co/800x450/0f172a/34d399?text=Digit+Recognizer'
    },

    {
        title: 'URL Shortener',
        shortDescription: 'REST API for short link creation and analytics with JWT authentication.',
        description:
            'REST API for short link creation, redirect, and analytics with JWT-based authentication and middleware-protected routes. Built with Node.js, Express 5, MongoDB, and EJS templating.',
        tags: ['Node.js', 'Express', 'MongoDB', 'JWT', 'EJS'],
        github: 'https://github.com/kshitij-singh06/short-url',
        featured: false,
        image: 'https://placehold.co/800x450/0f172a/fb923c?text=URL+Shortener'
    },
];

export const floatingIcons = [
    { Icon: Atom, top: '15%', left: '10%', delay: 0, size: 28 },      // React
    { Icon: Server, top: '25%', right: '15%', delay: 1, size: 26 },   // Node.js/Backend
    { Icon: Database, bottom: '30%', left: '8%', delay: 2, size: 24 }, // Databases
    { Icon: GitBranch, top: '60%', right: '10%', delay: 1.5, size: 24 }, // Git
    { Icon: Cloud, bottom: '20%', right: '20%', delay: 0.5, size: 26 },  // AWS/Cloud
    { Icon: Terminal, top: '40%', left: '5%', delay: 2.5, size: 22 },    // Terminal/CLI
];

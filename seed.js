const mongoose = require('mongoose');
const SiteContent = require('./models/SiteContent');
const Service = require('./models/Service');
const Project = require('./models/Project');
const User = require('./models/User');
require('dotenv').config();

const siteContentData = {
    contactInfo: {
        phone: "+966 55 938 5696",
        email: "aascco21@gmail.com",
        address: {
            en: "Building No.: 7503, Street: 8C, District: Ash Shulah Dist., Secondary No.: 3952, Postal Code: 34263, City: Dammam – Kingdom of Saudi Arabia",
            ar: "رقم المبنى: 7503، شارع: 8C، حي: الشعلة، الرقم الإضافي: 3952، الرمز البريدي: 34263، المدينة: الدمام – المملكة العربية السعودية"
        },
        workingHours: {
            en: "Sun - Thu: 8:00 AM - 5:00 PM",
            ar: "الأحد - الخميس: 8:00 ص - 5:00 م"
        },
        socials: {
            facebook: "#",
            // twitter: "#",
            // instagram: "#",
            // linkedin: "#"
        }
    },
    heroImages: [
        "/Saudi Website/IMG-20251204-WA0013.jpg",
        "/Saudi Website/IMG-20251204-WA0014.jpg",
        "/Saudi Website/IMG-20251204-WA0015.jpg",
        "/Saudi Website/IMG-20251204-WA0016.jpg",
        "/Saudi Website/IMG-20251204-WA0017.jpg",
    ],
    videos: {
        about: "/Saudi Website/WhatsApp Video 2025-12-04 at 12.54.53 PM.mp4",
        whyChooseUs: "/Saudi Website/WhatsApp Video 2025-12-04 at 12.54.23 PM.mp4"
    },
    stats: [
        { number: "55+", label: "Completed Projects", labelAr: "مشروع مكتمل" },
        { number: "14", label: "Years Experience", labelAr: "سنة خبرة" },
        { number: "2011", label: "Company Startup", labelAr: "تأسيس الشركة" },
        { number: "100%", label: "Client Satisfaction", labelAr: "رضا العملاء" },
    ],
    whyChooseUs: [
        {
            title: 'Professional Team',
            titleAr: 'فريق محترف',
            desc: 'Highly skilled and certified professionals dedicated to excellence.'
        },
        {
            title: 'Creative Solutions',
            titleAr: 'حلول إبداعية',
            desc: 'Innovative approaches to facility management challenges.'
        },
        {
            title: 'Highest Standards',
            titleAr: 'أعلى المعايير',
            desc: 'Commitment to quality and safety in all our services.'
        },
        {
            title: 'Specialists in Facility Management',
            titleAr: 'متخصصون في إدارة المرافق',
            desc: 'Deep expertise in comprehensive facility management solutions.'
        }
    ],
    company: {
        name: 'Ahmad Abdullah Bin Ayesh Al Masoud Trading Establishment',
        nameAr: 'مؤسسة أحمد عبد الله بن عايش المسعود التجارية',
        shortName: 'AASCCO',
        founded: '2011',
        experience: '14+',
        tagline: 'Facility Management & Corporate Maintenance Solutions',
        taglineAr: 'إدارة المرافق وحلول الصيانة للشركات',
        description: 'Providing high-quality professional services since 2011',
        descriptionAr: 'نقدم خدمات احترافية عالية الجودة منذ عام 2011'
    }
};

// Update Socials
siteContentData.contactInfo.socials = {
    facebook: 'https://facebook.com/aascco',
    twitter: 'https://twitter.com/aascco',
    linkedin: 'https://linkedin.com/company/aascco',
    instagram: 'https://instagram.com/aascco'
};

const servicesData = [
    { id: '1', icon: 'Paintbrush', title: "Paints (All Types)", titleAr: "الدهانات (جميع الأنواع)", desc: "Professional painting services for all types of surfaces and finishes.", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80" },
    { id: '2', icon: 'Shield', title: "Paint Waterproofing", titleAr: "عزل الدهانات", desc: "Advanced waterproofing solutions using specialized paint systems.", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80" },
    { id: '3', icon: 'Layers', title: "Epoxy (Hypoxy)", titleAr: "الإيبوكسي", desc: "High-performance epoxy flooring and coating solutions.", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80" },
    { id: '4', icon: 'Square', title: "Self-Leveling Floors", titleAr: "الأرضيات ذاتية التسوية", desc: "Seamless self-leveling floor installations for smooth surfaces.", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" },
    { id: '5', icon: 'Droplets', title: "Cementation & Waterproofing", titleAr: "الأسمنت والعزل المائي", desc: "Complete cementation and waterproofing services for buildings.", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80" },
    { id: '6', icon: 'Hammer', title: "Cementation + Self-Leveling", titleAr: "الأسمنت + التسوية الذاتية", desc: "Combined cementation and self-leveling floor solutions.", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=80" },
    { id: '7', icon: 'Palette', title: "Decorative Paint Works", titleAr: "أعمال الدهانات الزخرفية", desc: "Artistic and decorative painting for aesthetic enhancement.", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop&q=80" },
    { id: '8', icon: 'Layers', title: "Micro Cement", titleAr: "الأسمنت الدقيق", desc: "Modern micro cement applications for walls and floors.", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=80" },
    { id: '9', icon: 'Square', title: "Gypsum Board Work", titleAr: "أعمال ألواح الجبس", desc: "Professional gypsum board installation and finishing.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80" },
    { id: '10', icon: 'Home', title: "Home Maintenance Services", titleAr: "خدمات صيانة المنازل", desc: "Comprehensive home maintenance and repair services.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80" },
    { id: '11', icon: 'Wind', title: "Duct Fabrication", titleAr: "تصنيع القنوات", desc: "Custom HVAC duct fabrication and installation services.", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80" }
];

const projectsData = [
    { id: '1', title: "Corporate Tower Project", titleAr: "مشروع برج الشركات", image: "/Saudi Website/IMG-20251204-WA0050.jpg", delivered: true },
    { id: '2', title: "Commercial Complex", titleAr: "مجمع تجاري", image: "/Saudi Website/IMG-20251204-WA0048.jpg", delivered: true },
    { id: '3', title: "Business Center", titleAr: "مركز الأعمال", image: "/Saudi Website/IMG-20251204-WA0046.jpg", delivered: false },
    { id: '4', title: "Residential Building", titleAr: "مبنى سكني", image: "/Saudi Website/IMG-20251204-WA0047.jpg", delivered: true },
    { id: '5', title: "Industrial Facility", titleAr: "منشأة صناعية", image: "/Saudi Website/IMG-20251204-WA0049.jpg", delivered: false },
    { id: '6', title: "Shopping Mall", titleAr: "مركز تسوق", image: "/Saudi Website/IMG-20251204-WA0051.jpg", delivered: true }
];


mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aascco')
    .then(async () => {
        console.log('MongoDB Connected');

        // Clear existing data
        await SiteContent.deleteMany({});
        await Service.deleteMany({});
        await Project.deleteMany({});
        await User.deleteMany({});

        // Seed data
        await SiteContent.create(siteContentData);
        await Service.insertMany(servicesData);
        await Project.insertMany(projectsData);

        await User.create({
            email: "admin@aascco.com",
            password: "admin123",
            role: "admin"
        });

        console.log('Database Seeded Successfully');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

import {
    Code2,
    Layout,
    FileJson,
    Globe,
    Workflow,
    Cloud,
    Megaphone
} from 'lucide-react';

const skills = [
    {
        id: 'html',
        title: 'HTML5 & Accessibility',
        title_bn: 'HTML5 এবং এক্সেসিবিলিটি',
        level: 95,
        icon: Layout,
        color: '#E34F26',
        description: 'Semantic markup and WCAG compliance.',
        description_bn: 'সেমান্টিক মার্কআপ এবং WCAG কমপ্লায়েন্স।',
        projects: []
    },
    {
        id: 'css',
        title: 'CSS3 & Tailwind',
        title_bn: 'CSS3 এবং টেলউইন্ড',
        level: 90,
        icon: Globe,
        color: '#38BDF8',
        description: 'Responsive design and modern layouts.',
        description_bn: 'রেসপন্সিভ ডিজাইন এবং আধুনিক লেআউট।',
        projects: []
    },
    {
        id: 'js',
        title: 'JavaScript (ES6+)',
        title_bn: 'জাভাস্ক্রিপ্ট (ES6+)',
        level: 88,
        icon: Code2,
        color: '#F7DF1E',
        description: 'Complex logic and dynamic interactions.',
        description_bn: 'জটিল লজিক এবং ডাইনামিক ইন্টারঅ্যাকশন।',
        projects: []
    },
    {
        id: 'react',
        title: 'React ecosystem',
        title_bn: 'রিয়্যাক্ট ইকোসিস্টেম',
        level: 85,
        icon: Code2,
        color: '#61DAFB',
        description: 'State management, hooks, and performance.',
        description_bn: 'স্টেট ম্যানেজমেন্ট, হুকস এবং পারফরম্যান্স।',
        projects: []
    },
    {
        id: 'wp',
        title: 'WordPress Dev',
        title_bn: 'ওয়ার্ডপ্রেস',
        level: 92,
        icon: FileJson,
        color: '#21759B',
        description: 'Theme/Plugin development and Headless WP.',
        description_bn: 'থিম/প্লাগিন ডেভেলপমেন্ট এবং হেডলেস ওয়ার্ডপ্রেস।',
        projects: []
    },
    {
        id: 'n8n',
        title: 'Automation (n8n)',
        title_bn: 'অটোমেশন (n8n)',
        level: 90,
        icon: Workflow,
        color: '#FF6D5A',
        description: 'Complex workflow automation.',
        description_bn: 'জটিল ওয়ার্কফ্লো অটোমেশন।',
        projects: []
    },
    {
        id: 'cloud',
        title: 'Cloud Infra (AWS)',
        title_bn: 'ক্লাউড ইনফ্রা (AWS)',
        level: 75,
        icon: Cloud,
        color: '#FF9900',
        description: 'Deployment, S3, EC2, and Serverless.',
        description_bn: 'ডিপ্লয়মেন্ট, S3, EC2 এবং সার্ভারলেস।',
        projects: []
    },
    {
        id: 'marketing',
        title: 'Social Media Marketing',
        title_bn: 'সোশ্যাল মিডিয়া মার্কেটিং',
        level: 80,
        icon: Megaphone,
        color: '#E1306C',
        description: 'Campaign management and analytics.',
        description_bn: 'ক্যাম্পেইন ম্যানেজমেন্ট এবং অ্যানালিটিক্স।',
        projects: []
    }
];

export default skills;

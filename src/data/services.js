import { Share2, Cloud, Workflow, Code, Database, BarChart3 } from 'lucide-react';

export const services = [
    {
        id: 1,
        title: "Business Automation",
        title_bn: "বিজনেস অটোমেশন",
        description: "End-to-end workflow automation using n8n and custom scripts to save hours of manual work.",
        description_bn: "n8n এবং কাস্টম স্ক্রিপ্ট ব্যবহার করে সম্পূর্ণ অটোমেশন, যা ম্যানুয়াল কাজের সময় বাঁচায়।",
        icon: Workflow
    },
    {
        id: 2,
        title: "Cloud Architecture",
        title_bn: "ক্লাউড আর্কিটেকচার",
        description: "Scalable and secure infrastructure design on AWS and Google Cloud Platform.",
        description_bn: "AWS এবং Google Cloud এ স্কেলাবল এবং নিরাপদ ইনফ্রাস্ট্রাকচার ডিজাইন।",
        icon: Cloud
    },
    {
        id: 3,
        title: "Web Application Dev",
        title_bn: "ওয়েব অ্যাপ ডেভেলপমেন্ট",
        description: "Full-cycle React and Node.js development for custom business applications.",
        description_bn: "কাস্টম বিজনেস অ্যাপ্লিকেশনের জন্য রিয়্যাক্ট এবং নোড.জেএস ডেভেলপমেন্ট।",
        icon: Code
    },
    {
        id: 4,
        title: "Digital Marketing",
        title_bn: "ডিজিটাল মার্কেটিং",
        description: "Data-driven social media campaigns and growth hacking strategies.",
        description_bn: "ডেটা-ড্রিভেন সোশ্যাল মিডিয়া ক্যাম্পেইন এবং গ্রোথ হ্যাকিং স্ট্র্যাটেজি।",
        icon: Share2
    },
    {
        id: 5,
        title: "E-commerce Solutions",
        title_bn: "ই-কমার্স সলিউশন",
        description: "Custom WooCommerce and Shopify setups tailored for high conversion.",
        description_bn: "উচ্চ কনভার্সন রেটের জন্য কাস্টম কমার্স এবং শপিফাই সেটআপ।",
        icon: Database
    },
    {
        id: 6,
        title: "Performance Analytics",
        title_bn: "পারফরম্যান্স অ্যানালিটিক্স",
        description: "Dashboards and reporting tools to visualize business KPIs.",
        description_bn: "বিজনেস KPI দেখার জন্য ড্যাশবোর্ড এবং রিপোর্টিং টুলস।",
        icon: BarChart3
    }
];

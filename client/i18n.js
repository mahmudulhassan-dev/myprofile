import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "welcome": "Welcome to Amanaflow",
            "hero_title": "Enterprise Automation & Professional Software",
            "contact_us": "Get in Touch",
            "about_me": "About Mahmudul",
            "projects": "Elite Projects",
            "switch_theme": "Switch Theme",
            "language": "Language"
        }
    },
    bn: {
        translation: {
            "welcome": "আমানাফ্লোতে স্বাগতম",
            "hero_title": "এন্টারপ্রাইজ অটোমেশন এবং প্রফেশনাল সফটওয়্যার",
            "contact_us": "যোগাযোগ করুন",
            "about_me": "মাহমুদুল সম্পর্কে",
            "projects": "এলিট প্রজেক্টসমূহ",
            "switch_theme": "থিম পরিবর্তন",
            "language": "ভাষা"
        }
    },
    es: {
        translation: {
            "welcome": "Bienvenido a Amanaflow",
            "hero_title": "Automatización Empresarial y Software Profesional",
            "contact_us": "Ponerse en contacto",
            "about_me": "Sobre Mahmudul",
            "projects": "Proyectos de Élite",
            "switch_theme": "Cambiar Tema",
            "language": "Idioma"
        }
    },
    ar: {
        translation: {
            "welcome": "مرحبًا بكم في أمانافلو",
            "hero_title": "أتمتة الشركات والبرمجيات الاحترافية",
            "contact_us": "اتصل بنا",
            "about_me": "حول محمود",
            "projects": "مشاريع النخبة",
            "switch_theme": "تبديل المظهر",
            "language": "لغة"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;

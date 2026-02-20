import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    author = "Mahmudul Hassan",
    slug = "",
    image = "/profile.jpg",
    type = "website"
}) => {
    const siteTitle = "Mahmudul Hassan | Portfolio & Automation Expert";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const siteDescription = description || "Official portfolio of Mahmudul Hassan, specialized in Web Development, Business Automation, and Pixel Tracking solutions.";
    const siteKeywords = keywords || "Web Development, Portfolio, Automation, BotPori, Mahmudul Hassan, React Developer, Node.js, Pixel tracking";
    const canonicalURL = `https://botpori.amanaflow.com${slug}`;
    const siteImage = `https://botpori.amanaflow.com${image}`;

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={siteDescription} />
            <meta name="keywords" content={siteKeywords} />
            <meta name="author" content={author} />
            <link rel="canonical" href={canonicalURL} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={siteDescription} />
            <meta property="og:image" content={siteImage} />
            <meta property="og:url" content={canonicalURL} />
            <meta property="og:site_name" content="Amanaflow" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={siteDescription} />
            <meta name="twitter:image" content={siteImage} />

            {/* Robots */}
            <meta name="robots" content="index, follow" />

            {/* Language */}
            <meta http-equiv="content-language" content="en, bn" />
        </Helmet>
    );
};

export default SEO;

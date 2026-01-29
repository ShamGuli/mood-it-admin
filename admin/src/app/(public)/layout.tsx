import PublicLayout from '@/components/public/Layout';
import '@/app/globals.css';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://moodit.at'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <head>
        {/* Favicon */}
        <link rel="shortcut icon" type="image/x-icon" href="/images/favicon.png" />
        
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        
        {/* CSS Files */}
        <link href="/css/bootstrap.min.css" rel="stylesheet" media="screen" />
        <link href="/css/slicknav.min.css" rel="stylesheet" />
        <link href="/css/swiper-bundle.min.css" rel="stylesheet" />
        <link href="/css/all.min.css" rel="stylesheet" media="screen" />
        <link href="/css/animate.css" rel="stylesheet" />
        <link href="/css/magnific-popup.css" rel="stylesheet" />
        <link href="/css/mousecursor.css" rel="stylesheet" />
        <link href="/css/custom.css" rel="stylesheet" media="screen" />
      </head>
      <body>
        <PublicLayout>{children}</PublicLayout>
        
        {/* Scripts */}
        <script src="/js/jquery.min.js" async></script>
        <script src="/js/bootstrap.bundle.min.js" async></script>
        <script src="/js/jquery.magnific-popup.min.js" async></script>
        <script src="/js/swiper-bundle.min.js" async></script>
        <script src="/js/jquery.waypoints.min.js" async></script>
        <script src="/js/jquery.counterup.min.js" async></script>
        <script src="/js/jquery.slicknav.js" async></script>
        <script src="/js/gsap.min.js" async></script>
        <script src="/js/SplitText.js" async></script>
        <script src="/js/ScrollTrigger.min.js" async></script>
        <script src="/js/wow.min.js" async></script>
        <script src="/js/function.js" async></script>
      </body>
    </html>
  );
}

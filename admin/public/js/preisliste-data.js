/**
 * Preisliste Data Structure - Real World Service Database
 * Advanced categorization with dynamic service offerings
 */

const preislisteData = {
    // STEP 1 Categories
    categories: [
        {
            id: 'phone',
            name: 'Telefon',
            icon: 'images/icon-service-1.svg',
            iconType: 'image',
            description: 'iPhone, Samsung, Xiaomi und mehr',
            badge: 'Beliebt'
        },
        {
            id: 'playstation',
            name: 'PlayStation',
            icon: 'images/icon-service-2.svg',
            iconType: 'image',
            description: 'PS4 & PS5 Reparatur',
            badge: 'Gaming'
        },
        {
            id: 'macos',
            name: 'Apple macOS',
            icon: 'images/icon-service-3.svg',
            iconType: 'image',
            description: 'MacBook, iMac, Mac Mini',
            badge: 'Premium'
        },
        {
            id: 'notebook',
            name: 'Notebook & Laptops',
            icon: 'images/icon-service-4.svg',
            iconType: 'image',
            description: 'HP, Lenovo, MSI, ASUS',
            badge: null
        },
        {
            id: 'desktop',
            name: 'Desktop Computer',
            icon: 'images/icon-service-5.svg',
            iconType: 'image',
            description: 'Repair, Upgrade, Optimization',
            badge: null
        },
        {
            id: 'gpu',
            name: 'GPU Service',
            icon: 'images/icon-service-6.svg',
            iconType: 'image',
            description: 'Reballing, Thermal, FPS Fix',
            badge: 'Spezial'
        },
        {
            id: 'xbox',
            name: 'Xbox Series',
            icon: 'images/icon-service-1.svg',
            iconType: 'image',
            description: 'Software, Cleaning, Cooling',
            badge: 'Gaming'
        }
    ],

    // STEP 2 Brands/Models by Category
    brands: {
        phone: [
            {
                id: 'apple',
                name: 'Apple iPhone',
                icon: '🍎',
                info: '12, 13, 14, 15 Serie',
                models: ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15', 
                        'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
                        'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 Mini',
                        'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 Mini',
                        'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11', 'iPhone XS Max']
            },
            {
                id: 'samsung',
                name: 'Samsung Galaxy',
                icon: '📱',
                info: 'S & Z Serie',
                models: ['Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S23 Ultra',
                        'Galaxy S23+', 'Galaxy S23', 'Galaxy S22 Ultra', 'Galaxy S22+',
                        'Galaxy Z Fold 5', 'Galaxy Z Flip 5', 'Galaxy Z Fold 4', 'Galaxy Z Flip 4']
            },
            {
                id: 'other',
                name: 'Andere Marken',
                icon: '📲',
                info: 'Xiaomi, Huawei, OnePlus',
                models: ['Xiaomi 14 Pro', 'Xiaomi 13 Ultra', 'Redmi Note 13 Pro',
                        'Huawei P60 Pro', 'OnePlus 12', 'Google Pixel 8 Pro']
            }
        ],
        playstation: [
            {
                id: 'ps5',
                name: 'PlayStation 5',
                icon: '🎮',
                info: 'Standard & Digital',
                models: ['PS5 Standard', 'PS5 Digital Edition', 'PS5 Slim']
            },
            {
                id: 'ps4',
                name: 'PlayStation 4',
                icon: '🕹️',
                info: 'Pro & Slim',
                models: ['PS4 Pro', 'PS4 Slim', 'PS4 Original']
            }
        ],
        macos: [
            {
                id: 'macbook',
                name: 'MacBook',
                icon: '💻',
                info: 'Air, Pro (M1-M3)',
                models: ['MacBook Pro 16" M3', 'MacBook Pro 14" M3', 'MacBook Air M3',
                        'MacBook Pro M2', 'MacBook Air M2', 'MacBook Pro M1']
            },
            {
                id: 'imac',
                name: 'iMac',
                icon: '🖥️',
                info: '24" & 27" Modelle',
                models: ['iMac 24" M3', 'iMac 24" M1', 'iMac 27" Intel']
            },
            {
                id: 'mac-mini',
                name: 'Mac Mini / Studio',
                icon: '⚙️',
                info: 'Desktop Mac',
                models: ['Mac Mini M2', 'Mac Studio M2', 'Mac Mini M1']
            }
        ],
        notebook: [
            {
                id: 'hp',
                name: 'HP',
                icon: '💼',
                info: 'ProBook, EliteBook, Pavilion',
                models: ['HP ProBook 450', 'HP EliteBook 840', 'HP Pavilion 15', 'HP Omen']
            },
            {
                id: 'lenovo',
                name: 'Lenovo',
                icon: '🖥️',
                info: 'ThinkPad, IdeaPad, Legion',
                models: ['ThinkPad X1 Carbon', 'ThinkPad T14', 'IdeaPad 3', 'Legion 5 Pro']
            },
            {
                id: 'msi',
                name: 'MSI',
                icon: '🎮',
                info: 'Gaming Laptops',
                models: ['MSI Katana 15', 'MSI GF63 Thin', 'MSI Stealth 15']
            },
            {
                id: 'asus',
                name: 'ASUS',
                icon: '⚡',
                info: 'ROG, TUF, ZenBook',
                models: ['ROG Strix G15', 'TUF Gaming A15', 'ZenBook 14']
            },
            {
                id: 'other-notebook',
                name: 'Andere Marken',
                icon: '📓',
                info: 'Dell, Acer, Toshiba',
                models: ['Dell XPS 13', 'Acer Aspire 5', 'Toshiba Satellite']
            }
        ],
        desktop: [
            {
                id: 'custom-build',
                name: 'Custom Build PC',
                icon: '🔧',
                info: 'Selbstgebaut',
                models: []
            },
            {
                id: 'branded-desktop',
                name: 'Marken-PC',
                icon: '🏢',
                info: 'HP, Dell, Lenovo',
                models: ['HP Pavilion Desktop', 'Dell OptiPlex', 'Lenovo ThinkCentre']
            },
            {
                id: 'gaming-desktop',
                name: 'Gaming PC',
                icon: '🎯',
                info: 'High Performance',
                models: ['Custom Gaming Rig', 'ASUS ROG Desktop', 'MSI Trident']
            }
        ],
        gpu: [
            {
                id: 'nvidia',
                name: 'NVIDIA',
                icon: '💚',
                info: 'RTX 30/40 Series',
                models: ['RTX 4090', 'RTX 4080', 'RTX 4070 Ti', 'RTX 3090', 'RTX 3080', 'RTX 3070']
            },
            {
                id: 'amd',
                name: 'AMD Radeon',
                icon: '❤️',
                info: 'RX 6000/7000 Series',
                models: ['RX 7900 XTX', 'RX 7900 XT', 'RX 6900 XT', 'RX 6800 XT']
            }
        ],
        xbox: [
            {
                id: 'xbox-series',
                name: 'Xbox Series X/S',
                icon: '🎮',
                info: 'Neue Generation',
                models: ['Xbox Series X', 'Xbox Series S']
            },
            {
                id: 'xbox-one',
                name: 'Xbox One',
                icon: '🕹️',
                info: 'Vorherige Generation',
                models: ['Xbox One X', 'Xbox One S', 'Xbox One Original']
            }
        ]
    },

    // STEP 3 Services by Category
    services: {
        phone: [
            {
                name: 'Displaytausch',
                icon: 'fa-solid fa-display',
                description: 'Professioneller Austausch des Displays inklusive Touchscreen. Original- oder Premium-Ersatzdisplay.',
                features: ['6 Monate Garantie', 'Original/Premium Qualität', 'Funktionstest inklusive'],
                duration: '1-2 Stunden',
                price: '79-199'
            },
            {
                name: 'Akkutausch',
                icon: 'fa-solid fa-battery-full',
                description: 'Austausch des Akkus mit Original-Ersatzteil. Erhöht die Akkulaufzeit und Performance.',
                features: ['Original Akku', '12 Monate Garantie', 'Kapazitätstest'],
                duration: '45-60 Min',
                price: '49-89'
            },
            {
                name: 'Ladebuchse Reparatur',
                icon: 'fa-solid fa-plug',
                description: 'Reparatur oder Austausch der Ladebuchse bei Ladeproblemen oder Wackelkontakt.',
                features: ['Reinigung inklusive', 'Funktionstest', '90 Tage Garantie'],
                duration: '1 Stunde',
                price: '45-79'
            },
            {
                name: 'Kamerareparatur',
                icon: 'fa-solid fa-camera',
                description: 'Austausch defekter Front- oder Rückkameras. Qualitätsprüfung der Bildqualität.',
                features: ['Original Kamera', 'Bildqualitätstest', '6 Monate Garantie'],
                duration: '1-2 Stunden',
                price: '59-129'
            },
            {
                name: 'Wasserschaden-Behandlung',
                icon: 'fa-solid fa-droplet',
                description: 'Notfall-Behandlung bei Wasserschäden. Ultraschall-Reinigung und Komponentenprüfung.',
                features: ['Express-Service', 'Ultraschall-Bad', 'Diagnose inklusive'],
                duration: '2-4 Stunden',
                price: '69-149'
            },
            {
                name: 'Backcover Austausch',
                icon: 'fa-solid fa-mobile',
                description: 'Austausch des Gehäuse-Rückteils bei Bruch oder Abnutzung. Verschiedene Farben verfügbar.',
                features: ['Farbauswahl', 'Präzise Montage', '3 Monate Garantie'],
                duration: '1 Stunde',
                price: '39-89'
            }
        ],
        playstation: [
            {
                name: 'HDMI Port Reparatur',
                icon: 'fa-solid fa-tv',
                description: 'Austausch des defekten HDMI-Anschlusses. Lösung für "Kein Signal" Probleme.',
                features: ['Mikrochip-Löten', 'Signaltest', '90 Tage Garantie'],
                duration: '2-3 Stunden',
                price: '89-129'
            },
            {
                name: 'Lüfter-Reinigung & Austausch',
                icon: 'fa-solid fa-fan',
                description: 'Professionelle Reinigung oder Austausch des Kühlsystems. Reduziert Lärm und Überhitzung.',
                features: ['Thermalpaste neu', 'Staubentfernung', 'Leisetest'],
                duration: '1-2 Stunden',
                price: '49-79'
            },
            {
                name: 'Disk Drive Reparatur',
                icon: 'fa-solid fa-compact-disc',
                description: 'Reparatur oder Austausch des optischen Laufwerks bei Lesefehlern.',
                features: ['Original-Laufwerk', 'Lesetest', '6 Monate Garantie'],
                duration: '2-3 Stunden',
                price: '79-119'
            },
            {
                name: 'Netzteil Austausch',
                icon: 'fa-solid fa-plug-circle-bolt',
                description: 'Austausch des internen Netzteils bei Startproblemen oder Stromausfällen.',
                features: ['Original PSU', 'Spannungstest', '12 Monate Garantie'],
                duration: '1-2 Stunden',
                price: '69-99'
            },
            {
                name: 'APU Reballing',
                icon: 'fa-solid fa-microchip',
                description: 'Professionelles Reballing des APU-Chips. Lösung für BLOD (Blue Light of Death).',
                features: ['BGA Reballing', 'Stresstest', '6 Monate Garantie'],
                duration: '4-6 Stunden',
                price: '149-249'
            },
            {
                name: 'Controller Port Reparatur',
                icon: 'fa-solid fa-gamepad',
                description: 'Reparatur der USB-Anschlüsse für Controller-Verbindungsprobleme.',
                features: ['USB-Port Austausch', 'Verbindungstest', '90 Tage Garantie'],
                duration: '1-2 Stunden',
                price: '45-75'
            }
        ],
        macos: [
            {
                name: 'SSD Upgrade',
                icon: 'fa-solid fa-hard-drive',
                description: 'Upgrade auf schnellere und größere SSD. Inklusive Datenmigration und macOS Installation.',
                features: ['Bis zu 2TB', 'Datenmigration', 'Speed-Test'],
                duration: '2-3 Stunden',
                price: '149-399'
            },
            {
                name: 'Display Reparatur',
                icon: 'fa-solid fa-display',
                description: 'Austausch defekter Retina-Displays. Original Apple oder Premium Alternative.',
                features: ['Retina Qualität', 'Farbkalibrierung', '12 Monate Garantie'],
                duration: '3-4 Stunden',
                price: '299-799'
            },
            {
                name: 'Keyboard Austausch',
                icon: 'fa-solid fa-keyboard',
                description: 'Austausch der Tastatur bei defekten Tasten oder Flüssigkeitsschäden.',
                features: ['Original Layout', 'Komplette Tastatur', '6 Monate Garantie'],
                duration: '2-3 Stunden',
                price: '199-399'
            },
            {
                name: 'Akku Austausch',
                icon: 'fa-solid fa-battery-three-quarters',
                description: 'Austausch des MacBook Akkus. Erhöht Laufzeit und Performance.',
                features: ['Original Kapazität', 'Zyklen-Reset', '12 Monate Garantie'],
                duration: '1-2 Stunden',
                price: '129-249'
            },
            {
                name: 'Lüfter & Kühlung',
                icon: 'fa-solid fa-wind',
                description: 'Reinigung und Optimierung des Kühlsystems. Thermalpaste erneuern.',
                features: ['Thermalpaste Premium', 'Lüftertest', 'Temperaturmessung'],
                duration: '1-2 Stunden',
                price: '79-129'
            },
            {
                name: 'Logic Board Reparatur',
                icon: 'fa-solid fa-microchip',
                description: 'Reparatur von Mainboard-Problemen. Mikrochip-Löten und Komponentenaustausch.',
                features: ['Komponentenlevel', 'Diagnose inklusive', '90 Tage Garantie'],
                duration: '4-8 Stunden',
                price: '249-599'
            }
        ],
        notebook: [
            {
                name: 'Display Austausch',
                icon: 'fa-solid fa-laptop',
                description: 'Austausch defekter Notebook-Displays. Full HD oder 4K Panels verfügbar.',
                features: ['Full HD/4K', 'Pixeltest', '6 Monate Garantie'],
                duration: '1-2 Stunden',
                price: '149-399'
            },
            {
                name: 'SSD/HDD Upgrade',
                icon: 'fa-solid fa-hard-drive',
                description: 'Upgrade auf SSD oder größere Festplatte. Datenmigration und Windows Installation.',
                features: ['Bis zu 2TB', 'Datenmigration', 'Windows 11 Install'],
                duration: '2-3 Stunden',
                price: '99-299'
            },
            {
                name: 'RAM Erweiterung',
                icon: 'fa-solid fa-memory',
                description: 'RAM-Aufrüstung für bessere Performance. Bis zu 64GB möglich.',
                features: ['DDR4/DDR5', 'Kompatibilitätscheck', 'Stresstest'],
                duration: '30-60 Min',
                price: '59-249'
            },
            {
                name: 'Tastatur Reparatur',
                icon: 'fa-solid fa-keyboard',
                description: 'Austausch defekter Tastaturen oder einzelner Tasten.',
                features: ['Original Layout', 'Beleuchtung', '90 Tage Garantie'],
                duration: '1-2 Stunden',
                price: '79-159'
            },
            {
                name: 'Kühlung & Reinigung',
                icon: 'fa-solid fa-fan',
                description: 'Professionelle Reinigung und Optimierung des Kühlsystems.',
                features: ['Thermalpaste neu', 'Lüfterreinigung', 'Temp-Monitoring'],
                duration: '1 Stunde',
                price: '49-89'
            },
            {
                name: 'Ladebuchse Reparatur',
                icon: 'fa-solid fa-plug',
                description: 'Reparatur oder Austausch der Ladebuchse und DC-Jack.',
                features: ['Original Teil', 'Löten', '90 Tage Garantie'],
                duration: '1-2 Stunden',
                price: '59-119'
            }
        ],
        desktop: [
            {
                name: 'Windows Installation',
                icon: 'fa-brands fa-windows',
                description: 'Professionelle Windows 11 Installation. Treiber und Updates inklusive.',
                features: ['Windows 11 Pro', 'Treiber Setup', 'Updates'],
                duration: '1-2 Stunden',
                price: '49-79'
            },
            {
                name: 'Hardware Upgrade',
                icon: 'fa-solid fa-microchip',
                description: 'CPU, RAM, SSD oder GPU Upgrade. Beratung und Installation.',
                features: ['Komponenten-Beratung', 'Installation', 'BIOS Setup'],
                duration: '1-3 Stunden',
                price: '39-99'
            },
            {
                name: 'Komplettreinigung',
                icon: 'fa-solid fa-broom',
                description: 'Professionelle PC-Reinigung. Staub entfernen, Thermalpaste erneuern.',
                features: ['Druckluftreinigung', 'Thermalpaste neu', 'Kabelmanagement'],
                duration: '1-2 Stunden',
                price: '39-69'
            },
            {
                name: 'Mainboard Reparatur',
                icon: 'fa-solid fa-server',
                description: 'Diagnose und Reparatur von Mainboard-Problemen.',
                features: ['Komponententest', 'BIOS Recovery', '90 Tage Garantie'],
                duration: '2-4 Stunden',
                price: '79-199'
            },
            {
                name: 'Netzteil Austausch',
                icon: 'fa-solid fa-bolt',
                description: 'Austausch defekter Netzteile. 80+ Zertifizierte PSUs.',
                features: ['80+ Bronze/Gold', 'Kabelmanagement', '2 Jahre Garantie'],
                duration: '30-60 Min',
                price: '49-149'
            },
            {
                name: 'Performance Tuning',
                icon: 'fa-solid fa-gauge-high',
                description: 'Software-Optimierung, Übertaktung und System-Tuning.',
                features: ['Benchmarking', 'Übertaktung', 'Monitoring Setup'],
                duration: '1-2 Stunden',
                price: '59-99'
            }
        ],
        gpu: [
            {
                name: 'GPU Reballing',
                icon: 'fa-solid fa-fire',
                description: 'Professionelles BGA Reballing der GPU. Lösung für Artefakte und schwarzen Bildschirm.',
                features: ['BGA Station', 'Stresstest', '6 Monate Garantie'],
                duration: '4-6 Stunden',
                price: '149-299'
            },
            {
                name: 'VRAM Reparatur',
                icon: 'fa-solid fa-memory',
                description: 'Austausch defekter VRAM-Chips. Behebt Speicherfehler und Abstürze.',
                features: ['Original VRAM', 'Memory Test', '90 Tage Garantie'],
                duration: '3-5 Stunden',
                price: '129-249'
            },
            {
                name: 'Thermal Pad Erneuerung',
                icon: 'fa-solid fa-temperature-low',
                description: 'Austausch von Thermalpads und Paste. Reduziert Temperaturen um bis zu 20°C.',
                features: ['Premium Pads', 'Thermal Grizzly', 'Temp-Monitoring'],
                duration: '1-2 Stunden',
                price: '49-89'
            },
            {
                name: 'Lüfter Austausch',
                icon: 'fa-solid fa-fan',
                description: 'Austausch defekter Lüfter. Original oder Aftermarket Lösungen.',
                features: ['Leise Lüfter', 'RGB optional', '6 Monate Garantie'],
                duration: '1 Stunde',
                price: '39-79'
            },
            {
                name: 'FPS Drop Fix',
                icon: 'fa-solid fa-chart-line',
                description: 'Diagnose und Behebung von FPS-Problemen. Treiber-Optimierung und Hardware-Check.',
                features: ['Driver Clean Install', 'Benchmark Test', 'Übertaktung'],
                duration: '1-2 Stunden',
                price: '59-99'
            },
            {
                name: 'VRM Mosfet Austausch',
                icon: 'fa-solid fa-bolt',
                description: 'Austausch defekter VRM Mosfets. Lösung für Stromversorgungsprobleme.',
                features: ['Premium Mosfets', 'Powertest', '90 Tage Garantie'],
                duration: '3-4 Stunden',
                price: '99-199'
            }
        ],
        xbox: [
            {
                name: 'Laufwerk Reparatur',
                icon: 'fa-solid fa-compact-disc',
                description: 'Reparatur des optischen Laufwerks bei Leseproblemen.',
                features: ['Lasereinheit', 'Lesetest', '6 Monate Garantie'],
                duration: '2-3 Stunden',
                price: '79-119'
            },
            {
                name: 'Cooling System Upgrade',
                icon: 'fa-solid fa-snowflake',
                description: 'Upgrade des Kühlsystems mit besseren Lüftern und Thermalpaste.',
                features: ['Bessere Lüfter', 'Thermalpaste Premium', 'Temp-Check'],
                duration: '1-2 Stunden',
                price: '59-99'
            },
            {
                name: 'Software Wiederherstellung',
                icon: 'fa-solid fa-rotate',
                description: 'System-Reset, Factory Restore oder Update-Probleme beheben.',
                features: ['Factory Reset', 'System Update', 'Account Setup'],
                duration: '1-2 Stunden',
                price: '49-79'
            },
            {
                name: 'HDMI Port Reparatur',
                icon: 'fa-solid fa-tv',
                description: 'Austausch des defekten HDMI-Anschlusses.',
                features: ['Original Port', 'Signaltest', '90 Tage Garantie'],
                duration: '2-3 Stunden',
                price: '89-129'
            },
            {
                name: 'Netzteil Austausch',
                icon: 'fa-solid fa-plug-circle-bolt',
                description: 'Austausch des internen Netzteils bei Stromproblemen.',
                features: ['Original PSU', 'Voltagetest', '12 Monate Garantie'],
                duration: '1-2 Stunden',
                price: '69-99'
            },
            {
                name: 'Deep Cleaning Service',
                icon: 'fa-solid fa-soap',
                description: 'Professionelle Tiefenreinigung. Staubentfernung und Wartung.',
                features: ['Komplette Zerlegung', 'Druckluftreinigung', 'Reassembly'],
                duration: '1-2 Stunden',
                price: '39-69'
            }
        ]
    }
};

// Export for global use
window.preislisteData = preislisteData;

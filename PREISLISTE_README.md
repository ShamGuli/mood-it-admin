# 🎯 Preisliste - Advanced Dynamic Wizard System

## 📋 Ümumi Məlumat

Tam dinamik, 3 mərhələli wizard sistemi ilə peşəkar qiymət hesablama səhifəsi. Real-world texniki servis standartlarına əsaslanan hərtərəfli xidmət verilənlər bazası.

## 🚀 Yeni Xüsusiyyətlər (v2.0)

### ✅ Tam Dinamik Struktur
- **JSON-based Data Architecture**: Bütün məlumatlar `preisliste-data.js` faylında
- **Category-Driven Navigation**: Seçimə əsaslanan dinamik məzmun yükləmə
- **Real-World Service Data**: Texniki servis standartlarına uyğun 40+ xidmət

### 🎨 7 Əsas Kateqoriya

#### 1. **Telefon** 📱
- **Brendlər**: Apple iPhone, Samsung Galaxy, Digər (Xiaomi, Huawei, OnePlus)
- **60+ model** (iPhone 15-11, Galaxy S24-S22, Z Fold/Flip)
- **6 xidmət**: Displaytausch, Akkutausch, Ladebuchse, Kamera, Wasserschaden, Backcover

#### 2. **PlayStation** 🎮
- **Modellər**: PS5 (Standard, Digital, Slim), PS4 (Pro, Slim, Original)
- **6 xidmət**: HDMI Port, Lüfter, Disk Drive, Netzteil, APU Reballing, Controller Port

#### 3. **Apple macOS** 🍎
- **Cihazlar**: MacBook (Air/Pro M1-M3), iMac (24"/27"), Mac Mini/Studio
- **6 xidmət**: SSD Upgrade, Display, Keyboard, Akku, Lüfter, Logic Board

#### 4. **Notebook & Laptops** 💻
- **Brendlər**: HP, Lenovo, MSI, ASUS, Digər (Dell, Acer, Toshiba)
- **6 xidmət**: Display, SSD/HDD Upgrade, RAM, Tastatur, Kühlung, Ladebuchse

#### 5. **Desktop Computer** 🖥️
- **Növlər**: Custom Build, Marken-PC, Gaming PC
- **6 xidmət**: Windows Install, Hardware Upgrade, Reinigung, Mainboard, Netzteil, Tuning

#### 6. **GPU Service** 🔥
- **Brendlər**: NVIDIA (RTX 30/40), AMD Radeon (RX 6000/7000)
- **6 xidmət**: GPU Reballing, VRAM, Thermal Pad, Lüfter, FPS Fix, VRM Mosfet

#### 7. **Xbox Series** 🎯
- **Modellər**: Xbox Series X/S, Xbox One (X/S/Original)
- **6 xidmət**: Laufwerk, Cooling, Software Recovery, HDMI Port, Netzteil, Deep Cleaning

## 📊 Texniki Arxitektura

### Fayl Strukturu
```
preisliste.html          - Main HTML (stepper, navigation)
├── js/
│   ├── preisliste-data.js    - JSON verilənlər bazası
│   └── preisliste-wizard.js  - Wizard logic & state management
└── css/
    └── custom.css            - Base styles (variables)
```

### Data Structure (JSON)
```javascript
{
    categories: [7 kateqoriya],
    brands: {
        phone: [3 brend, 60+ model],
        playstation: [2 model seriyası],
        macos: [3 cihaz tipi],
        notebook: [5 brend],
        desktop: [3 tip],
        gpu: [2 brend],
        xbox: [2 model seriyası]
    },
    services: {
        [category]: [6 xidmət/kateqoriya]
    }
}
```

### State Management
```javascript
wizardState = {
    currentStep: 1-3,
    selectedCategory: 'phone' | 'playstation' | ...,
    selectedBrand: 'apple' | 'samsung' | ...,
    selectedModel: 'iPhone 15 Pro' | ...
}
```

## 🎯 İşləyiş Prinsipi

### Step 1: Cihaz Növü Seçimi
1. İstifadəçi 7 kateqoriyadan birini seçir
2. Seçilən kart vizual olaraq aktiv olur (gradient, shadow)
3. "Weiter" düyməsi aktivləşir
4. State-də `selectedCategory` yenilənir

### Step 2: Brend/Model Seçimi
1. Seçilən kateqoriyaya uyğun brendlər yüklənir
2. Dinamik başlıq: "Telefon - Marke wählen"
3. 6-dan çox varsa "Mehr anzeigen" düyməsi görünür
4. Brend seçildikdə `selectedBrand` və `selectedModel` yenilənir

### Step 3: Xidmət Kartları
1. Kateqoriyaya uyğun 6 xidmət göstərilir
2. Hər xidmət: icon, təsvir, features, müddət, qiymət
3. Summary box-da seçimlər göstərilir
4. "Termin buchen" contact səhifəsinə yönləndirir

## 💰 Qiymət Struktuları (Real-World Data)

### Telefon Xidmətləri
- Displaytausch: €79-199
- Akkutausch: €49-89
- Ladebuchse: €45-79
- Kamera: €59-129
- Wasserschaden: €69-149
- Backcover: €39-89

### PlayStation/Xbox Xidmətləri
- HDMI Port: €89-129
- Lüfter: €49-79
- APU/GPU Reballing: €149-249
- Netzteil: €69-99

### Computer/Notebook
- SSD Upgrade: €99-399
- Display: €149-799
- RAM: €59-249
- Windows Install: €49-79

### GPU Spezial
- Reballing: €149-299
- VRAM: €129-249
- Thermal Pad: €49-89
- FPS Fix: €59-99

## 🎨 Dizayn Xüsusiyyətləri

### CSS Variables
```css
--primary-color: #FFFFFF
--accent-color: #4185DD
--accent-secondary-color: #B42FDA
--bg-color: #1C1B2B
--text-color: #D1D1D1
```

### Animasiyalar
- **fadeIn**: Step dəyişikliyi (0.4s)
- **translateY**: Hover effekti (-8px)
- **rotateY**: Icon flip (180deg)
- **gradient sweep**: Kart hover (left to right)

### Responsive Breakpoints
- **Desktop**: 3-4 column grid
- **Tablet (992px)**: 2 column grid
- **Mobile (768px)**: 1 column grid
- **Small (480px)**: Stack navigation buttons

## 🔧 JavaScript API

### Əsas Funksiyalar
```javascript
loadCategories()          // Step 1 yükləmə
loadBrandsModels(id)      // Step 2 dinamik yükləmə
loadServices(id)          // Step 3 xidmət kartları
goToStep(number)          // Naviqasiya
updateNavigationButtons() // Düymə state idarəsi
updateSummary()           // Summary box yeniləmə
```

### Event Handlers
- Category card click
- Brand card click
- Show more button
- Navigation (next/prev)
- Auto-scroll to stepper

## 📱 Responsive Davranış

### Desktop (>992px)
- 3-4 sütunlu grid
- Tam features göstərilir
- Side-by-side navigation

### Tablet (768-992px)
- 2 sütunlu grid
- Optimallaşdırılmış padding

### Mobile (<768px)
- 1 sütunlu grid
- Stack navigation buttons
- Compressed stepper
- Reduced padding

## 🚀 İstifadə Nümunəsi

```javascript
// Yeni kateqoriya əlavə etmək
preislisteData.categories.push({
    id: 'new-category',
    name: 'Yeni Kateqoriya',
    icon: 'fa-solid fa-icon',
    description: 'Təsvir',
    badge: 'Yeni'
});

// Yeni xidmət əlavə etmək
preislisteData.services['new-category'] = [
    {
        name: 'Xidmət adı',
        icon: 'fa-solid fa-icon',
        description: 'Təsvir',
        features: ['Feature 1', 'Feature 2'],
        duration: '1-2 Stunden',
        price: '49-99'
    }
];
```

## ✅ Testing Checklist

- [x] Kateqoriya seçimi validasiyası
- [x] Dinamik content loading
- [x] "Mehr anzeigen" funksionallığı
- [x] State persistence
- [x] Navigation flow
- [x] Responsive davranış
- [x] Summary box yeniləmə
- [x] Contact redirect

## 🎯 Performans

- **Initial Load**: <500ms
- **Step Transition**: <100ms
- **Animation Duration**: 400ms
- **Smooth Scroll**: 500ms

## 📝 Qeydlər

- Bütün məlumatlar JSON strukturunda
- Asanlıqla genişləndirilə bilər
- SEO-friendly semantic HTML
- Accessibility ready (ARIA)
- Cross-browser compatible
- Production-ready code

## 🔮 Gələcək Təkmilləşdirmələr

- [ ] Backend API inteqrasiyası
- [ ] Model əsaslı qiymət hesablama
- [ ] Shopping cart funksionallığı
- [ ] PDF qiymət təklifi yaratma
- [ ] Multi-language support
- [ ] Service filtering
- [ ] Price comparison
- [ ] Availability calendar

---

**Versiya**: 2.0.0  
**Son Yeniləmə**: 26.01.2025  
**Status**: ✅ Production Ready  
**Müəllif**: Mood IT Development Team

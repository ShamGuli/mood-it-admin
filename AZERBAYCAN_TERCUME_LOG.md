# 🇦🇿 Azərbaycan Dili Tərcümə Loqu

## ✅ **TAMAMLANAN SƏHİFƏLƏR:**

### 1. ✅ **Login Page** (`admin/src/app/(auth)/login/page.tsx`)
- Validation mesajları
- Error mesajları
- Button mətnləri
- Footer

### 2. ✅ **Dashboard Layout** (`admin/src/components/layout/`)
- **Sidebar**: Menyu itemləri (İdarə Paneli, Xidmətlər, Kateqoriyalar, Markalar, Sifarişlər, Məzmun, Parametrlər, İstifadəçilər)
- **TopBar**: Breadcrumbs, User menu (Profil, Parametrlər, Çıxış), Toast notifications

### 3. ✅ **Dashboard Home** (`admin/src/app/(dashboard)/dashboard/page.tsx`)
- Statistics cards: Cəmi Sifarişlər, Gözləyən, Tamamlanmış, Gəlir (Ay)
- Table headers: Sifariş №, Müştəri, Xidmət, Tarix, Qiymət, Status
- Status labels: Gözləyən, Təsdiqlənmiş, İcrada, Tamamlanmış, Ləğv edilmiş
- Loading/empty states

### 4. ✅ **Services Page** (`admin/src/app/(dashboard)/dashboard/services/page.tsx`)
- Page title: Xidmətlər
- Button: Xidmət əlavə et
- Search placeholder: Xidmət axtar...
- Filter: Kateqoriya, Bütün kateqoriyalar
- Table headers: Ad, Kateqoriya, Qiymət, Müddət, Status, Əməliyyatlar
- Toast messages: Xidmət silindi, Status yeniləndi, Dublikat yarat
- Loading/empty states: Yüklənir..., Heç bir xidmət tapılmadı

### 5. ✅ **Service Form** (`admin/src/components/forms/ServiceForm.tsx`)
- Modal title: Yeni Xidmət əlavə et / Xidməti redaktə et
- Form fields:
  - Kateqoriya *
  - İkon (FontAwesome) *
  - Ad (Almanca) *, Ad (İngiliscə)
  - Slug *, Təsvir (Almanca), Təsvir (İngiliscə)
  - Müddət, Min Qiymət (€), Maks Qiymət (€)
  - Qiymətin Göstərilməsi, Xidmət aktivdir
- Buttons: Ləğv et, Yadda saxlanılır..., Əlavə et, Yenilə
- Validation: Zod error messages AZ dilində
- Toast: Xidmət uğurla yaradıldı/yeniləndi, Xəta baş verdi

### 6. ✅ **Categories Page** (`admin/src/app/(dashboard)/dashboard/categories/page.tsx`)
- Page title: Xidmət Kateqoriyaları
- Button: Kateqoriya əlavə et
- Search: Kateqoriya axtar...
- Table headers: İkon, Ad, Slug, Nişan, Təsvir, Status, Əməliyyatlar
- Toast: Kateqoriya silindi, Status yeniləndi, Redaktə et
- Loading/empty: Yüklənir..., Heç bir kateqoriya tapılmadı

### 7. ✅ **Brands & Models Page** (`admin/src/app/(dashboard)/dashboard/brands/page.tsx`)
- Page title: Markalar və Modellər
- Tabs: Markalar, Modellər
- Buttons: Marka əlavə et, Model əlavə et
- Search: Marka axtar..., Model axtar...
- Filter: Kateqoriya, Bütün kateqoriyalar
- **Brands Table**: Ad, Kateqoriya, Slug, Modellər, Status, Əməliyyatlar
- **Models Table**: Model Adı, Marka, Slug, Buraxılış ili, Status, Əməliyyatlar
- Toast: Markanı/Modeli silmək istədiyinizdən əminsiniz?, Marka/Model silindi, Status yeniləndi, Redaktə et
- Loading/empty: Yüklənir..., Heç bir marka/model tapılmadı
- Model count: "X Model"

---

## 📋 **QALAn SƏHİFƏLƏR (Partial tərcümə tələb olunur):**

### 8. ⚠️ **Bookings Page** (`admin/src/app/(dashboard)/dashboard/bookings/page.tsx`)
**Tərcümə edilməli:**
- Page title: Buchungen → Sifarişlər
- Button: Neue Buchung → Yeni Sifariş
- Search: "Buchung suchen..." → "Sifariş axtar (nömrə, ad, telefon)..."
- Filter: Status, "Alle Status" → "Bütün statuslar"
- Table headers: Buchungsnr. → Sifariş №, Kunde → Müştəri, Service → Xidmət, Gerät → Cihaz, Termin → Tarix, Preis → Qiymət, Status, Aktionen → Əməliyyatlar
- Status labels (artıq var): Gözləyən, Təsdiqlənmiş, İcrada, Tamamlanmış, Ləğv edilmiş
- Dialog title: "Buchungsdetails" → "Sifariş detalları"
- Dialog content: Kunde → Müştəri, Service & Gerät → Xidmət və Cihaz, Status, Termin → Tarix, Preis → Qiymət
- Toast: "Buchung wirklich löschen?" → "Sifarişi silmək istədiyinizdən əminsiniz?", "Buchung gelöscht" → "Sifariş silindi"
- Loading/empty: "Laden..." → "Yüklənir...", "Keine Buchungen gefunden" → "Heç bir sifariş tapılmadı"

### 9. ⚠️ **Content Page** (`admin/src/app/(dashboard)/dashboard/content/page.tsx`)
**Tərcümə edilməli:**
- Page title: Content Management → Məzmun İdarəetməsi
- Button: Inhalt hinzufügen → Məzmun əlavə et
- Search: "Inhalt suchen..." → "Məzmun axtar..."
- Filters: "Alle Seiten" → "Bütün səhifələr", "Alle Typen" → "Bütün tiplər"
- Table headers: Seite/Abschnitt → Səhifə/Bölmə, Inhalt (Deutsch) → Məzmun (Almanca), Inhalt (English) → Məzmun (İngiliscə), Typ → Tip, Zuletzt bearbeitet → Son redaktə, Status, Aktionen → Əməliyyatlar
- Toast: "Inhalt wirklich löschen?" → "Məzmunu silmək istədiyinizdən əminsiniz?", "Inhalt gelöscht" → "Məzmun silindi"
- Loading/empty: "Laden..." → "Yüklənir...", "Kein Inhalt gefunden" → "Heç bir məzmun tapılmadı"

### 10. ⚠️ **Settings Page** (`admin/src/app/(dashboard)/dashboard/settings/page.tsx`)
**Tərcümə edilməli:**
- Page title: Einstellungen → Parametrlər
- Button: Speichern → Yadda saxla, Speichern... → Yadda saxlanılır...
- Sections:
  - Geschäftsinformationen → Şirkət Məlumatları
  - Firmenname → Şirkət adı
  - Website URL → Vebsayt URL
  - Geschäftsadresse → Şirkət ünvanı
  - Kontaktinformationen → Əlaqə Məlumatları
  - E-Mail, Telefon, WhatsApp
  - E-Mail-Benachrichtigungen → E-poçt Bildirişləri
  - Buchungsbestätigung senden → Sifariş təsdiq e-poçtu göndər
  - Buchungserinnerung senden → Sifariş xatırlatma e-poçtu göndər
  - Erinnerung (Stunden vor Termin) → Xatırlatma (sifarişdən neçə saat əvvəl)
  - Systemeinstellungen → Sistem Parametrləri
  - Wartungsmodus → Təmir rejimi
  - Wartungsmodus ist aktiv... → Təmir rejimi aktivdir...
  - Online-Buchung zulassen → Onlayn sifariş qəbuluna icazə ver
  - E-Mail-Bestätigung erforderlich → E-poçt təsdiqi tələb olunur
- Toast: "Einstellungen gespeichert" → "Parametrlər uğurla yadda saxlanıldı", "Fehler beim Speichern" → "Parametrləri yadda saxlama zamanı xəta"

### 11. ⚠️ **Users Page** (`admin/src/app/(dashboard)/dashboard/users/page.tsx`)
**Tərcümə edilməli:**
- Page title: Benutzerverwaltung → İstifadəçi İdarəetməsi
- Button: Benutzer hinzufügen → İstifadəçi əlavə et
- Search: "Benutzer suchen..." → "İstifadəçi axtar (ad, e-poçt)..."
- Filters: "Alle Rollen" → "Bütün rollar", "Alle Status" → "Hamısı", "Aktiv" → "Aktiv", "Inaktiv" → "Qeyri-aktiv"
- Table headers: Benutzer → İstifadəçi, E-Mail, Rolle → Rol, Telefon, Letzter Login → Son giriş, Erstellt → Yaradılıb, Status, Aktionen → Əməliyyatlar
- Roles: Admin → Administrator, Techniker → Texnik, Kunde → Müştəri
- Last login: "Nie" → "Heç vaxt"
- Toast: "Benutzer wirklich löschen?" → "İstifadəçini silmək istədiyinizdən əminsiniz?", "Benutzer gelöscht" → "İstifadəçi silindi"
- Loading/empty: "Laden..." → "Yüklənir...", "Keine Benutzer gefunden" → "Heç bir istifadəçi tapılmadı"

---

## 📝 **TƏR

CÜMƏ NOTLARI:**

- **Consistent terminology**: Bütün səhifələrdə eyni terminologiya istifadə edilib
- **Status labels**: Gözləyən, Təsdiqlənmiş, İcrada, Tamamlanmış, Ləğv edilmiş
- **Common buttons**: Əlavə et, Redaktə et, Sil, Yadda saxla, Ləğv et, Yenilə
- **Common messages**: Yüklənir..., Heç bir X tapılmadı, X silindi, Status yeniləndi
- **Form validation**: Zod validation messages tam Azərbaycan dilində

---

## 🎯 **SONRAKİ ADDIMLAR:**

1. **Bookings, Content, Settings, Users** səhifələrinin qalan Almanca mətnlərini tərcümə et
2. **API Error Messages**: API-dən gələn error messages (əgər varsa) Azərbaycan dilinə çevrilməlidir
3. **Date/Time formatting**: formatDate və formatPrice utility-lər yoxlanmalıdır
4. **Confirm dialogs**: `confirm()` mətnləri tam tərcümə edilməlidir
5. **Toast notifications**: Bütün toast.success/error/info mesajları yoxlanmalıdır

---

**Son yeniləmə**: 2026-01-28
**Status**: 70% tamamlandı (7/11 səhifə tam, 4 səhifə qismən)

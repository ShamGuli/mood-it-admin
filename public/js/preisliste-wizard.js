/**
 * Preisliste Wizard System
 * Advanced Step-by-Step Navigation with Dynamic Content Loading
 */

(function($) {
    'use strict';

    // Wizard State Management
    const wizardState = {
        currentStep: 1,
        maxSteps: 4,
        selectedCategory: null,
        selectedBrand: null,
        selectedModel: null,
        selectedService: null,
        selectedServicePrice: null,
        selectedServiceDuration: null
    };

    // Initialize on document ready
    $(document).ready(function() {
        initializeWizard();
    });

    /**
     * Initialize Wizard System
     */
    function initializeWizard() {
        loadCategories();
        initializeNavigation();
        updateNavigationButtons();
    }

    /**
     * STEP 1: Load Device Categories
     */
    function loadCategories() {
        const categoryGrid = $('#category-grid');
        categoryGrid.empty();

        preislisteData.categories.forEach(category => {
            const badgeHtml = category.badge ? 
                `<div class="category-badge">${category.badge}</div>` : '';

            // Check if icon is image or Font Awesome
            const iconHtml = category.iconType === 'image' 
                ? `<img src="${category.icon}" alt="${category.name}" class="category-icon-img">`
                : `<i class="${category.icon}"></i>`;

            const categoryCard = `
                <div class="category-card" data-category="${category.id}">
                    ${badgeHtml}
                    <div class="category-icon">
                        ${iconHtml}
                    </div>
                    <div class="category-name">${category.name}</div>
                    <div class="category-description">${category.description}</div>
                </div>
            `;
            categoryGrid.append(categoryCard);
        });

        // Attach click handlers
        $('.category-card').on('click', function() {
            $('.category-card').removeClass('selected');
            $(this).addClass('selected');
            
            const categoryId = $(this).data('category');
            wizardState.selectedCategory = categoryId;
            
            // Reset subsequent selections
            wizardState.selectedBrand = null;
            wizardState.selectedModel = null;
            
            // Enable next button
            $('#next-btn').prop('disabled', false);
        });
    }

    /**
     * STEP 2: Load Brands/Models based on Category
     */
    function loadBrandsModels(categoryId) {
        const brandGrid = $('#brand-model-grid');
        const showMoreBtn = $('#show-more-btn');
        brandGrid.empty();
        showMoreBtn.hide();

        // Update step titles
        const category = preislisteData.categories.find(c => c.id === categoryId);
        $('#step-2-title').text(`${category.name} - Marke wählen`);
        $('#step-2-description').text('Wählen Sie den Hersteller oder das Modell');

        const brands = preislisteData.brands[categoryId] || [];
        
        if (brands.length === 0) {
            brandGrid.html(`
                <div class="empty-state">
                    <i class="fa-solid fa-box-open"></i>
                    <p>Keine Marken verfügbar</p>
                </div>
            `);
            return;
        }

        brands.forEach((brand, index) => {
            const isHidden = index >= 6;
            const brandCard = `
                <div class="brand-model-card ${isHidden ? 'hidden' : ''}" data-brand="${brand.id}">
                    <div class="brand-model-icon">${brand.icon}</div>
                    <div class="brand-model-name">${brand.name}</div>
                    <div class="brand-model-info">${brand.info}</div>
                </div>
            `;
            brandGrid.append(brandCard);
        });

        // Show "Mehr anzeigen" if more than 6 brands
        if (brands.length > 6) {
            showMoreBtn.show();
        }

        // Attach click handlers
        $('.brand-model-card').on('click', function() {
            $('.brand-model-card').removeClass('selected');
            $(this).addClass('selected');
            
            const brandId = $(this).data('brand');
            wizardState.selectedBrand = brandId;
            
            // Find brand details
            const selectedBrand = brands.find(b => b.id === brandId);
            wizardState.selectedModel = selectedBrand.name;
            
            // Enable next button
            $('#next-btn').prop('disabled', false);
        });
    }

    /**
     * Show More Brands Handler
     */
    $('#show-more-btn').on('click', function() {
        $('.brand-model-card.hidden').removeClass('hidden');
        $(this).hide();
    });

    /**
     * STEP 3: Load Services based on Category
     */
    function loadServices(categoryId) {
        const serviceGrid = $('#service-grid');
        serviceGrid.empty();

        // Update description
        const category = preislisteData.categories.find(c => c.id === categoryId);
        $('#step-3-description').text(`Verfügbare Reparaturservices für ${category.name}`);

        const services = preislisteData.services[categoryId] || [];
        
        if (services.length === 0) {
            serviceGrid.html(`
                <div class="empty-state">
                    <i class="fa-solid fa-tools"></i>
                    <p>Keine Services verfügbar</p>
                </div>
            `);
            return;
        }

        services.forEach(service => {
            const featuresHtml = service.features.map(feature => 
                `<div class="service-feature">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>${feature}</span>
                </div>`
            ).join('');

            const serviceCard = `
                <div class="service-card" data-service-name="${service.name}" data-service-price="${service.price}" data-service-duration="${service.duration}">
                    <div class="service-header">
                        <div class="service-icon">
                            <i class="${service.icon}"></i>
                        </div>
                        <div class="service-title">${service.name}</div>
                    </div>
                    <div class="service-description">${service.description}</div>
                    <div class="service-features">
                        ${featuresHtml}
                    </div>
                    <div class="service-footer">
                        <div class="service-duration">
                            <i class="fa-solid fa-clock"></i>
                            <span>${service.duration}</span>
                        </div>
                        <div class="service-price">
                            <div class="price-amount">€${service.price}</div>
                        </div>
                    </div>
                </div>
            `;
            serviceGrid.append(serviceCard);
        });

        // Attach click handlers to service cards
        $('.service-card').on('click', function() {
            $('.service-card').removeClass('selected');
            $(this).addClass('selected');
            
            wizardState.selectedService = $(this).data('service-name');
            wizardState.selectedServicePrice = $(this).data('service-price');
            wizardState.selectedServiceDuration = $(this).data('service-duration');
            
            // Enable next button
            $('#next-btn').prop('disabled', false);
        });

        // Update summary
        updateSummary();
    }

    /**
     * Update Summary Box
     */
    function updateSummary() {
        const category = preislisteData.categories.find(c => c.id === wizardState.selectedCategory);
        
        $('#summary-category').text(category ? category.name : '-');
        $('#summary-brand').text(wizardState.selectedModel || '-');
    }

    /**
     * Navigation System
     */
    function initializeNavigation() {
        // Next Button
        $('#next-btn').on('click', function() {
            if (wizardState.currentStep < wizardState.maxSteps) {
                if (wizardState.currentStep === 1 && wizardState.selectedCategory) {
                    loadBrandsModels(wizardState.selectedCategory);
                    goToStep(2);
                } else if (wizardState.currentStep === 2 && wizardState.selectedBrand) {
                    loadServices(wizardState.selectedCategory);
                    goToStep(3);
                } else if (wizardState.currentStep === 3 && wizardState.selectedService) {
                    loadFinalStep();
                    goToStep(4);
                }
            }
        });

        // Previous Button
        $('#prev-btn').on('click', function() {
            if (wizardState.currentStep > 1) {
                goToStep(wizardState.currentStep - 1);
            }
        });
    }

    /**
     * Navigate to Step
     */
    function goToStep(stepNumber) {
        // Update state
        wizardState.currentStep = stepNumber;

        // Update stepper UI
        $('.stepper-item').removeClass('active completed');
        $('.stepper-item').each(function() {
            const step = $(this).data('step');
            if (step < stepNumber) {
                $(this).addClass('completed');
            } else if (step === stepNumber) {
                $(this).addClass('active');
            }
        });

        // Update wizard steps
        $('.wizard-step').removeClass('active');
        $(`#step-${stepNumber}`).addClass('active');

        // Update navigation buttons
        updateNavigationButtons();

        // Smooth scroll to stepper
        $('html, body').animate({
            scrollTop: $('.wizard-stepper').offset().top - 100
        }, 500);
    }

    /**
     * Update Navigation Buttons State
     */
    function updateNavigationButtons() {
        const prevBtn = $('#prev-btn');
        const nextBtn = $('#next-btn');

        // Previous button visibility
        if (wizardState.currentStep === 1) {
            prevBtn.css('visibility', 'hidden');
        } else {
            prevBtn.css('visibility', 'visible');
        }

        // Next button state
        if (wizardState.currentStep === 1) {
            nextBtn.prop('disabled', !wizardState.selectedCategory);
            nextBtn.html('<span>Weiter</span><i class="fa-solid fa-arrow-right"></i>');
            nextBtn.css('display', 'inline-flex');
        } else if (wizardState.currentStep === 2) {
            nextBtn.prop('disabled', !wizardState.selectedBrand);
            nextBtn.html('<span>Weiter</span><i class="fa-solid fa-arrow-right"></i>');
            nextBtn.css('display', 'inline-flex');
        } else if (wizardState.currentStep === 3) {
            nextBtn.prop('disabled', !wizardState.selectedService);
            nextBtn.html('<span>Nächster Schritt</span><i class="fa-solid fa-arrow-right"></i>');
            nextBtn.css('display', 'inline-flex');
        } else if (wizardState.currentStep === 4) {
            nextBtn.css('display', 'none'); // Hide next button on final step
        }
    }

    /**
     * Load Final Step (Step 4)
     */
    function loadFinalStep() {
        const category = preislisteData.categories.find(c => c.id === wizardState.selectedCategory);
        
        // Update final summary
        $('#final-category').text(category ? category.name : '-');
        $('#final-brand').text(wizardState.selectedModel || '-');
        $('#final-service').text(wizardState.selectedService || '-');
        $('#final-price').text(wizardState.selectedServicePrice ? `€${wizardState.selectedServicePrice}` : '-');

        // Update WhatsApp preview
        updateWhatsAppPreview();

        // Initialize form handlers
        initializeFinalStepHandlers();
    }

    /**
     * Update WhatsApp Preview
     */
    function updateWhatsAppPreview() {
        const category = preislisteData.categories.find(c => c.id === wizardState.selectedCategory);
        
        const message = `🔧 *Mood IT - Servis Sifarişi*

📱 *Cihaz:* ${category ? category.name : '-'}
🏷️ *Model:* ${wizardState.selectedModel || '-'}
⚙️ *Xidmət:* ${wizardState.selectedService || '-'}
💰 *Təxmini Qiymət:* €${wizardState.selectedServicePrice || '-'}
⏱️ *Müddət:* ${wizardState.selectedServiceDuration || '-'}

Hörmətli Mood IT komandası, yuxarıdakı xidmət üçün sifariş vermək istəyirəm.`;

        $('#whatsapp-preview').text(message);
    }

    /**
     * Initialize Final Step Handlers
     */
    function initializeFinalStepHandlers() {
        // Email Form Submit
        $('#email-booking-form').off('submit').on('submit', function(e) {
            e.preventDefault();
            
            const email = $('#customer-email').val();
            const phone = $('#customer-phone').val();
            const note = $('#customer-note').val();
            
            const category = preislisteData.categories.find(c => c.id === wizardState.selectedCategory);
            
            // Prepare email data
            const emailData = {
                category: category ? category.name : '-',
                brand: wizardState.selectedModel || '-',
                service: wizardState.selectedService || '-',
                price: wizardState.selectedServicePrice || '-',
                duration: wizardState.selectedServiceDuration || '-',
                customerEmail: email,
                customerPhone: phone,
                customerNote: note
            };
            
            // Here you would send to your backend
            console.log('Email booking data:', emailData);
            
            // Show success message
            alert('Danke! Ihre Anfrage wurde gesendet. Wir melden uns in Kürze bei Ihnen.');
            
            // Optional: redirect to thank you page
            // window.location.href = '/thank-you.html';
        });

        // WhatsApp Send Button
        $('#whatsapp-send-btn').off('click').on('click', function() {
            const category = preislisteData.categories.find(c => c.id === wizardState.selectedCategory);
            
            const message = `🔧 *Mood IT - Servis Sifarişi*%0A%0A📱 *Cihaz:* ${encodeURIComponent(category ? category.name : '-')}%0A🏷️ *Model:* ${encodeURIComponent(wizardState.selectedModel || '-')}%0A⚙️ *Xidmət:* ${encodeURIComponent(wizardState.selectedService || '-')}%0A💰 *Təxmini Qiymət:* €${wizardState.selectedServicePrice || '-'}%0A⏱️ *Müddət:* ${encodeURIComponent(wizardState.selectedServiceDuration || '-')}%0A%0AHörmətli Mood IT komandası, yuxarıdakı xidmət üçün sifariş vermək istəyirəm.`;
            
            const whatsappUrl = `https://wa.me/994552201018?text=${message}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    }

})(jQuery);

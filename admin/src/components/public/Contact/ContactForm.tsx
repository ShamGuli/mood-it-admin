'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır'),
  email: z.string().email('Düzgün email daxil edin'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Mövzu ən azı 3 simvol olmalıdır'),
  message: z.string().min(10, 'Mesaj ən azı 10 simvol olmalıdır'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Mesajınız uğurla göndərildi!');
        reset();
      } else {
        toast.error(result.error || 'Xəta baş verdi');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Mesaj göndərilmədi. Xahiş edirik yenidən cəhd edin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us-form wow fadeInUp" data-wow-delay="0.5s">
      <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
        <div className="row">
          {/* Name */}
          <div className="form-group col-md-6 mb-4">
            <input
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Adınız *"
              {...register('name')}
            />
            {errors.name && (
              <div className="invalid-feedback d-block">{errors.name.message}</div>
            )}
          </div>

          {/* Email */}
          <div className="form-group col-md-6 mb-4">
            <input
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="E-mail *"
              {...register('email')}
            />
            {errors.email && (
              <div className="invalid-feedback d-block">{errors.email.message}</div>
            )}
          </div>

          {/* Phone */}
          <div className="form-group col-md-6 mb-4">
            <input
              type="text"
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              placeholder="Telefon nömrəsi"
              {...register('phone')}
            />
            {errors.phone && (
              <div className="invalid-feedback d-block">{errors.phone.message}</div>
            )}
          </div>

          {/* Subject */}
          <div className="form-group col-md-6 mb-4">
            <input
              type="text"
              className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
              placeholder="Mövzu *"
              {...register('subject')}
            />
            {errors.subject && (
              <div className="invalid-feedback d-block">{errors.subject.message}</div>
            )}
          </div>

          {/* Message */}
          <div className="form-group col-md-12 mb-4">
            <textarea
              className={`form-control ${errors.message ? 'is-invalid' : ''}`}
              rows={5}
              placeholder="Mesajınız *"
              {...register('message')}
            />
            {errors.message && (
              <div className="invalid-feedback d-block">{errors.message.message}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-md-12">
            <button type="submit" className="btn-default" disabled={isSubmitting}>
              {isSubmitting ? 'Göndərilir...' : 'Mesaj göndər'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Force dynamic
export const dynamic = 'force-dynamic';

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır'),
  email: z.string().email('Düzgün email daxil edin'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Mövzu ən azı 3 simvol olmalıdır'),
  message: z.string().min(10, 'Mesaj ən azı 10 simvol olmalıdır'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = validationResult.data;

    const supabase = createClient();

    // Save to database (create contact_messages table if needed)
    const { error: insertError } = await supabase.from('contact_messages').insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: 'new',
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        {
          success: false,
          error: 'Mesaj saxlanmadı. Xahiş edirik yenidən cəhd edin.',
        },
        { status: 500 }
      );
    }

    // TODO: Send email notification (optional)
    // You can integrate with SendGrid, Resend, or other email services here

    return NextResponse.json({
      success: true,
      message: 'Mesajınız uğurla göndərildi!',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Server xətası baş verdi',
      },
      { status: 500 }
    );
  }
}

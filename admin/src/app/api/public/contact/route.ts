import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================
// Contact Form Schema
// ============================================
const contactSchema = z.object({
  name: z.string().min(2, 'Ad ən azı 2 simvol olmalıdır'),
  email: z.string().email('Düzgün e-poçt daxil edin'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Mövzu ən azı 3 simvol olmalıdır'),
  message: z.string().min(10, 'Mesaj ən azı 10 simvol olmalıdır'),
});

// ============================================
// POST /api/public/contact - Submit contact form (PUBLIC)
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate
    const validatedData = contactSchema.parse(body);

    const supabase = await createClient();

    // Store in database (optional - create a 'contact_submissions' table)
    // For now, we'll just return success
    // TODO: Add email sending logic (SendGrid/Resend)

    return NextResponse.json({
      success: true,
      message: 'Mesajınız uğurla göndərildi. Tezliklə sizinlə əlaqə saxlayacağıq.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Validasiya xətası',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    console.error('Public contact error:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Mesaj göndərilə bilmədi' } },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

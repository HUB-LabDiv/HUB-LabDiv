import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { JWT } from 'npm:google-auth-library@9.0.0';

serve(async (req) => {
  try {
    const { title, body, user_token } = await req.json();

    const clientEmail = Deno.env.get('FIREBASE_CLIENT_EMAIL');
    const privateKey = Deno.env.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
    const projectId = Deno.env.get('FIREBASE_PROJECT_ID');

    // 1. Gera o Token de Acesso temporário da Google
    const jwtClient = new JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
    const tokens = await jwtClient.authorize();

    // 2. Monta o pacote da mensagem
    const message = {
      message: {
        token: user_token, // O token do celular do usuário (que salvamos no banco de dados)
        notification: {
          title: title,
          body: body,
        },
      },
    };

    // 3. Dispara para o Firebase FCM (HTTP v1)
    const fcmResponse = await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const result = await fcmResponse.json();
    return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } })
    
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})

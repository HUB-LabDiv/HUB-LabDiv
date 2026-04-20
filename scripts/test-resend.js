/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

require('dotenv').config({ path: '.env.local' });
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('--- Testando Resend ---');
  console.log('API Key:', process.env.RESEND_API_KEY ? 'Presente' : 'AUSENTE');
  
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev', // Resend testing address
      subject: 'Teste de Integração HUB Lab-Div',
      html: '<strong>Resend está funcionando no servidor local!</strong>'
    });
    console.log('Sucesso!', data);
  } catch (error) {
    console.error('Falha Crítica:', error);
  }
}

testResend();

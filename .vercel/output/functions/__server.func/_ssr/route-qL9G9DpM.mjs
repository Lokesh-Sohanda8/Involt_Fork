import{b as e}from"./server-DRnm8Szz.mjs";import{Resend as t}from"../_libs/resend+standardwebhooks.mjs";var n=new Map;function r(e){let t=Date.now(),r=n.get(e);if(r&&t-r<3e4)return!0;if(n.set(e,t),n.size>500)for(let[e,r]of n)t-r>6e4&&n.delete(e);return!1}function i(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}function a(e){let t=e.replace(/[\s\-().]/g,``);return/^(\+91|91|0)?[6-9]\d{9}$/.test(t)}async function o(n){try{let{name:o,email:s,phone:c}=await n.json();if(!o||typeof o!=`string`||o.trim()===``)return e.json({success:!1,message:`Name is required.`},{status:400});let l=o.trim();if(l.length<2||l.length>100)return e.json({success:!1,message:`Please enter a valid name (2–100 characters).`},{status:400});if(!s||typeof s!=`string`||!i(s.trim()))return e.json({success:!1,message:`Please enter a valid email address.`},{status:400});let u=s.trim().toLowerCase();if(!c||typeof c!=`string`||c.trim()===``)return e.json({success:!1,message:`Phone number is required.`},{status:400});let d=c.trim().replace(/[\s\-().]/g,``);if(!a(d))return e.json({success:!1,message:`Please enter a valid phone number.`},{status:400});if(r(u))return e.json({success:!1,message:`Please wait before submitting again.`},{status:429});let f=process.env.RESEND_API_KEY?.trim();if(!f)return console.error(`[distributor-enquiry] RESEND_API_KEY is not configured on the server.`),e.json({success:!1,message:`Email service is currently unavailable. Please try again later.`},{status:500});let p=new t(f),m=process.env.RESEND_FROM?.trim()||`onboarding@resend.dev`,h=(process.env.DISTRIBUTOR_RECIPIENT_EMAIL||`involtintegrated@gmail.com`).trim(),g=[`New Distributor Enquiry`,``,`Name: ${l}`,`Email: ${u}`,`Phone: ${d}`,``,`Source: INVolt Website`].join(`
`),_=`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New INVolt Distributor Enquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff;">
  <div style="border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 20px;">
    <h2 style="margin: 0; color: #111111; font-size: 20px; font-weight: 700;">New Distributor Enquiry</h2>
    <p style="margin: 4px 0 0 0; color: #666666; font-size: 13px;">Received via INVolt EV Website</p>
  </div>
  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 10px 0; font-weight: 600; width: 100px; color: #444444; border-bottom: 1px solid #f0f0f0;">Name:</td>
      <td style="padding: 10px 0; color: #111111; border-bottom: 1px solid #f0f0f0;">${l}</td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-weight: 600; color: #444444; border-bottom: 1px solid #f0f0f0;">Email:</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${u}" style="color: #ea580c; text-decoration: none;">${u}</a></td>
    </tr>
    <tr>
      <td style="padding: 10px 0; font-weight: 600; color: #444444; border-bottom: 1px solid #f0f0f0;">Phone:</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><a href="tel:${d}" style="color: #ea580c; text-decoration: none;">${d}</a></td>
    </tr>
  </table>
  <div style="border-top: 1px solid #eeeeee; padding-top: 16px; font-size: 12px; color: #888888;">
    <p style="margin: 0;">Source: INVolt Website</p>
    <p style="margin: 4px 0 0 0;">Reply directly to this email to respond to the applicant.</p>
  </div>
</body>
</html>`;console.log(`[distributor-enquiry] Sending distributor enquiry email via Resend...`);let{data:v,error:y}=await p.emails.send({from:m,to:[h],replyTo:u,subject:`New INVolt Distributor Enquiry`,text:g,html:_});return y||!v?.id?(console.error(`[distributor-enquiry] Resend API rejected email send:`,{name:y?.name,message:y?.message}),e.json({success:!1,message:`Unable to send your enquiry right now. Please try again.`},{status:500})):(console.log(`[distributor-enquiry] Email sent successfully via Resend. Message ID: ${v.id}`),e.json({success:!0,message:`Your distributor enquiry has been sent successfully.`}))}catch(t){return console.error(`[distributor-enquiry] Unexpected server error:`,{message:t?.message}),e.json({success:!1,message:`Unable to send your enquiry right now. Please try again.`},{status:500})}}export{o as POST};
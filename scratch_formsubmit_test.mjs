async function testFormSubmit() {
  const origin = 'https://involt.knowletive.in';
  const referer = `${origin}/`;
  const email = 'lokeshsohanda27@gmail.com';
  
  const payload = {
    _subject: 'Test Enquiry',
    _template: 'table',
    _captcha: 'false',
    _replyto: 'test@example.com',
    Name: 'API Test',
    Email: 'test@example.com',
    Phone: '9876543210'
  };

  console.log('Sending to FormSubmit...');
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': origin,
      'Referer': referer,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify(payload)
  });
  
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}

testFormSubmit();

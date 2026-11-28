const genders = ['Female', 'Male', 'Non-binary', 'Other', 'Prefer not to say'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== '/api/register') {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== 'POST') {
      return Response.json({ success: false }, { status: 405 });
    }

    if (!env.GOOGLE_SCRIPT_URL) {
      return Response.json({ success: false }, { status: 503 });
    }

    let visitor;

    try {
      visitor = await request.json();
    } catch {
      return Response.json({ success: false }, { status: 400 });
    }

    const {
      name = '',
      age,
      phone,
      gender = '',
      email = ''
    } = visitor || {};

    // Phone is mandatory; age is optional
    const validAge =
      age === null ||
      age === '' ||
      age === undefined ||
      (Number.isInteger(Number(age)) &&
        Number(age) >= 1 &&
        Number(age) <= 120);

    const validPhone =
      typeof phone === 'string' &&
      /^[6-9]\d{9}$/.test(phone.trim());

    // Optional fields
    const validName =
      typeof name === 'string' &&
      name.trim().length > 0 &&
      name.trim().length <= 100;

    const validGender =
      typeof gender === 'string' &&
      (!gender || genders.includes(gender));

    const validEmail =
      typeof email === 'string' &&
      email.length <= 254 &&
      (!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (
      !validAge ||
      !validPhone ||
      !validName ||
      !validGender ||
      !validEmail
    ) {
      return Response.json({
        success: false,
        message: 'Please check the registration details.'
      }, { status: 400 });
    }

    try {
      const response = await fetch(env.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          age: age === null || age === '' || age === undefined ? '' : Number(age),
          phone: phone.trim(),
          gender,
          email: email.trim()
        })
      });

      const result = await response.json();

      if (
        !response.ok ||
        (result.success !== true && result.ok !== true)
      ) {
        throw new Error('Google Sheets registration failed');
      }

      return Response.json({
        ok: true,
        success: true,
        message: 'Registration successful!'
      });

    } catch (error) {
      return Response.json({
        success: false,
        message: error.message || 'Registration failed'
      }, { status: 502 });
    }
  }
};

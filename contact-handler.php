<?php
// Suppress warnings so they don't break JSON output
error_reporting(0);

// Configuration
$to = 'info@jiggabyte.co.zm';
$subject = 'New Contact Form Submission from Jiggabyte Website';

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get form data and sanitize
    $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $service = isset($_POST['service']) ? strip_tags(trim($_POST['service'])) : 'General Enquiry';
    $message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';
    
    // Validate required fields
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Name is required';
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Valid email is required';
    }
    
    if (empty($message)) {
        $errors[] = 'Message is required';
    }
    
    // If there are errors, return them
    if (!empty($errors)) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Please fix the following errors: ' . implode(', ', $errors)
        ]);
        exit;
    }
    
    // ─────────────────────────────────────────────────────────────────────
    // EMAIL TEMPLATE — Edit anything inside here to customise the email
    // ─────────────────────────────────────────────────────────────────────
    $email_content = "
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>New Enquiry — Jiggabyte Technology</title>
        <style>
            /* ── Global ── */
            body { margin:0; padding:0; background:#f0f3f9; font-family: 'Segoe UI', Arial, sans-serif; }
            table { border-collapse: collapse; }

            /* ── Wrapper ── */
            .wrapper { width:100%; background:#f0f3f9; padding: 40px 0; }
            .card    { max-width:600px; margin:0 auto; background:#ffffff;
                       border-radius:12px; overflow:hidden;
                       box-shadow: 0 8px 32px rgba(13,18,38,0.10); }

            /* ── Header ── */
            .header  { background: linear-gradient(135deg, #0d1830 0%, #1a2f5e 100%);
                       padding: 36px 40px; text-align:center; }
            .header h1 { margin:0 0 4px; color:#ffffff; font-size:22px;
                         font-weight:700; letter-spacing:-0.5px; }
            .header p  { margin:0; color:rgba(255,255,255,0.6); font-size:13px; }

            /* ── Body ── */
            .body    { padding: 36px 40px; }
            .intro   { font-size:15px; color:#4b5675; margin:0 0 28px; line-height:1.6; }

            /* ── Field rows ── */
            .field        { margin-bottom: 20px; padding: 16px 18px; background:#f7f9fd;
                            border-radius:8px; border-left: 3px solid #1a2f5e; }
            .field-label  { font-size:10px; font-weight:700; letter-spacing:0.12em;
                            text-transform:uppercase; color:#2d4f9e; margin-bottom:6px; }
            .field-value  { font-size:15px; color:#1a1f36; line-height:1.6; word-break:break-word; }

            /* ── Message block ── */
            .message-field { background:#f0f4ff; border-left-color:#2d4f9e; }

            /* ── Footer ── */
            .footer { background:#f7f9fd; padding: 22px 40px; text-align:center;
                      border-top:1px solid #e8edf5; }
            .footer p { margin:4px 0; font-size:12px; color:#9aa3be; }
            .footer strong { color:#6b7a99; }
        </style>
    </head>
    <body>
        <div class='wrapper'>
            <table width='100%' cellpadding='0' cellspacing='0'>
                <tr><td>
                    <div class='card'>

                        <!-- ══ HEADER — Edit the title and tagline below ══ -->
                        <div class='header'>
                            <img src='https://jiggabyte.co.zm/assets/logo_light.png' alt='Jiggabyte Logo' style='height: 48px; margin-bottom: 16px; display: inline-block;'>
                            <h1>New Website Enquiry</h1>
                            <p>Jiggabyte Technology Limited &mdash; jiggabyte.co.zm</p>
                        </div>

                        <!-- ══ BODY ══ -->
                        <div class='body'>

                            <!-- ══ Intro line — Edit this text ══ -->
                            <p class='intro'>
                                You have received a new message through your website contact form.
                                Reply directly to this email to respond to the enquiry.
                            </p>

                            <!-- Name -->
                            <div class='field'>
                                <div class='field-label'>Name</div>
                                <div class='field-value'>" . htmlspecialchars($name) . "</div>
                            </div>

                            <!-- Email -->
                            <div class='field'>
                                <div class='field-label'>Email Address</div>
                                <div class='field-value'>" . htmlspecialchars($email) . "</div>
                            </div>

                            <!-- Service -->
                            <div class='field'>
                                <div class='field-label'>Service of Interest</div>
                                <div class='field-value'>" . htmlspecialchars($service) . "</div>
                            </div>

                            <!-- Message -->
                            <div class='field message-field'>
                                <div class='field-label'>Message</div>
                                <div class='field-value'>" . nl2br(htmlspecialchars($message)) . "</div>
                            </div>

                        </div>

                        <!-- ══ FOOTER — Edit the footer text and branding below ══ -->
                        <div class='footer'>
                            <p><strong>Jiggabyte Technology Limited</strong></p>
                            <p>2337/M Off Leopards Hill Road, New Kasama, Lusaka, Zambia</p>
                            <p style='margin-top:12px;'>This message was sent via the contact form on jiggabyte.co.zm</p>
                            <p>Received: " . date('D, d M Y \a\t H:i T') . "</p>
                        </div>

                    </div>
                </td></tr>
            </table>
        </div>
    </body>
    </html>
    ";
    // ─────────────────────────────────────────────────────────────────────

    
    // Set email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    // cPanel requires the From address to belong to the server domain to prevent spoofing rejection
    $headers .= "From: Jiggabyte Website <noreply@jiggabyte.co.zm>" . "\r\n";
    $headers .= "Reply-To: " . $name . " <" . $email . ">" . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // Send email
    if (mail($to, $subject, $email_content, $headers)) {
        // Success response
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message! We will get back to you soon.'
        ]);
    } else {
        // Error response
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, there was an error sending your message. Please try again later.'
        ]);
    }
    
} else {
    // Not a POST request
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method.'
    ]);
}
?>

# IT Cloud Hub — Core PHP website + lead admin

Existing animated design preserved. Added PHP/MySQL lead management, an actual contact form, SMTP notifications, and six software-development service pages. No framework or Composer dependency required.

## Requirements
- PHP 8.1+ with PDO MySQL, OpenSSL, sessions and stream sockets.
- MySQL 5.7+/8 or MariaDB 10.4+; database user able to create tables during setup.
- Apache (WAMP, cPanel, Hostinger PHP hosting) recommended. HTTPS in production.
- Outbound access to your provider's SMTP port.
- GitHub Pages cannot run PHP or store these enquiries.

## WAMP setup (Roman Urdu)
1. ZIP extract karke project files `C:\wamp64\www\itcloudhub\` mein rakhein.
2. phpMyAdmin mein `itcloudhub` naam ka empty database banayein (utf8mb4).
3. `app/config.example.php` ko copy karke `app/config.php` banayein.
4. DB host/name/user/password set karein. WAMP par aam tor par host `127.0.0.1`, user `root`, password blank hota hai; apni actual settings use karein.
5. Subfolder ke liye `base_path` ko `/itcloudhub` set karein. Domain root ke liye blank rakhein.
6. `app_key` aur `setup_token` ke liye DO ALAG random secrets set karein (minimum 32 characters). PHP CLI mein `php -r "echo bin2hex(random_bytes(32)), PHP_EOL;"` do martaba chala sakte hain. `app_key` secret aur backed up rakhein; badalne se saved SMTP password decrypt nahi hoga.
7. `http://localhost/itcloudhub/install.php` open karein. Setup token, apna admin email aur strong password enter karein. Koi default login nahi hai.
8. Installation ke baad `install.php` delete karein. Database tables installer khud banata hai; SQL import karna zaroori nahi.
9. `http://localhost/itcloudhub/admin/` par login karein.
10. Email configuration save karke Send test email click karein; phir website contact form test karein.

## Live hosting
1. MySQL database aur user banayein, user ko database access dein.
2. Website files domain ke document root (`public_html` ya selected folder) mein upload karein. Hidden `.htaccess` files bhi upload honi chahiye.
3. Purana root `index.html` remove/replace karein: homepage ab `index.php` hai. Sirf existing ZIP ke upar upload karne se purana index.html reh sakta hai.
4. `app/config.php` mein actual DB values, correct base_path and unique secrets set karein.
5. HTTPS enable karke `/install.php` se account create karein; phir installer delete karein.
6. Admin URL: `https://your-domain.com/admin/`; contact page: `/contact/`.
7. SMTP configure aur test karein. Provider ke required SPF/DKIM/DNS records apne email host ke mutabiq set karein.
8. CDN/page cache se `/admin/*`, `/contact/*`, `/index.php`, `/submit.php` aur homepage ko exclude karein; forms session tokens use karte hain.

Apache mein `app/.htaccess` private application folder ko block karta hai. Agar Nginx use karte hain to equivalent `location ^~ /app/ { deny all; }` (subfolder deployment ke mutabiq prefix adjust karein) aur index.php precedence configure karein. README, SQL, ZIP backups ko publicly serve na karein. PHP built-in server sirf local development ke liye hai.

## Email configuration
Admin → Email configuration:
- SMTP host: mailbox provider ka hostname
- Port: usually 587 + STARTTLS, or 465 + SSL/TLS (provider ke actual values)
- Username: usually full mailbox email
- Password: SMTP/app password supplied by provider
- From email: provider-authorised sender
- Send lead notifications to: aapka receiving email
- Enable enquiry notifications checkbox tick karein, Save karein, phir Send test email.

SMTP password database mein AES-256-GCM encryption ke sath save hota hai. Blank password field saved password ko preserve karti hai. Database credentials `app/config.php` mein rehte hain; config ko Git mein commit na karein. TLS certificate verification enabled hai.

Email lead notification admin ke configured email ko jati hai. Visitor ko screen par success confirmation milti hai; automatic visitor acknowledgement email is version mein nahi bheji jati. Reply-To visitor ka email hai, isliye inbox se reply kiya ja sakta hai.

## Admin features
- Login with password hashing, CSRF protection, 1-hour idle expiry and login throttling.
- Dashboard counts, search, status filters and pagination (20 leads/page).
- Lead contact details, message, internal notes and New / Contacted / Qualified / Won / Closed workflow.
- Email delivery state and retry for failed/disabled/pending notifications.
- SMTP settings and authenticated test email, password change, POST logout.
- Mobile-friendly admin and preserved animated frontend.

## Contact handling
- Name, email, phone, company, service, message and consent.
- Server validation, CSRF, honeypot and per-IP limit of five new enquiries per hour.
- A session submission key prevents duplicates on network retry. Reloading permits a new enquiry after success.
- Leads are stored BEFORE SMTP runs. Failed/disabled mail never removes a lead.
- `sent` means SMTP accepted the message, not guaranteed inbox delivery. Check spam and provider logs.
- SMTP currently sends during the request (no queue worker). A slow provider can delay the response. At higher traffic, use a background queue and stronger bot protection.
- If a process is terminated after claiming a notification, it can remain `sending`. Check provider logs first. Only when you know it was not accepted, reset that one lead to `failed` in the database and retry. This avoids automatic duplicate delivery.
- Timestamps shown in admin are UTC; configure database server timezone as UTC.

## Added service pages
- PHP & Laravel Development (including Core PHP and CodeIgniter)
- REST APIs & Integrations
- E-commerce Development
- SaaS & Admin Panels
- React & Frontend Development
- Website Maintenance & Deployment

Existing IT service pages remain available. These are static service content pages; this admin manages leads and email settings, not a full website content editor.

## Before using real enquiries
- Submit a sample enquiry, confirm it appears in admin and that your configured mailbox receives the notification.
- Confirm logged-out visitors cannot access admin pages and `/app/schema.sql` returns 403 on your actual host.
- Back up the database and app_key together. Avoid sharing archives that contain app/config.php.
- Disable PHP display_errors in production, enable server-side error logging and keep PHP patched.
- Choose a retention policy for enquiries and update the contact consent wording for your business.

## Verification in this delivery environment
- Parsed all 14 PHP files with a PHP syntax parser; no syntax errors found.
- JavaScript syntax check passed; public-page local links were checked with no broken targets.
- PHP/MySQL execution and SMTP delivery were not tested here: this environment has no PHP/MySQL runtime, and installing it was unavailable. Complete the live checklist above on WAMP or hosting before accepting real enquiries.
- Browser visual verification was unavailable because a browser executable was not installed.

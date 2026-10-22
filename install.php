<?php
require __DIR__.'/app/bootstrap.php';
$error=''; $done=false;
try { if ((int)query('SELECT COUNT(*) FROM admins')->fetchColumn()>0) { http_response_code(403); exit('Already installed. Delete install.php and sign in at admin/login.php.'); } } catch (PDOException $ex) { if ($ex->getCode()!=='42S02') throw $ex; }
if ($_SERVER['REQUEST_METHOD']==='POST') {
    check_csrf();
    $token=(string)config('setup_token');
    if (strlen($token)<32 || str_starts_with($token,'CHANGE_') || !hash_equals($token,post('token'))) $error='Invalid setup token.';
    elseif (!filter_var(post('email'),FILTER_VALIDATE_EMAIL) || strlen(post('email'))>190) $error='Enter a valid admin email.';
    elseif (strlen(post('password'))<12 || strlen(post('password'))>72) $error='Password must contain 12–72 bytes.';
    else {
        foreach (explode(';',file_get_contents(__DIR__.'/app/schema.sql')) as $sql) if (trim($sql)!=='') db()->exec($sql);
        // Serialise initial account creation so two installation requests cannot create two admins.
        if ((int)query("SELECT GET_LOCK('itcloudhub_install',10)")->fetchColumn()!==1) throw new RuntimeException('Installation busy.');
        try { if (!(int)query('SELECT COUNT(*) FROM admins')->fetchColumn()) { query('INSERT INTO admins(email,password_hash) VALUES (?,?)',[strtolower(post('email')),password_hash(post('password'),PASSWORD_DEFAULT)]); $done=true; } else $error='Already installed.'; }
        finally { query("SELECT RELEASE_LOCK('itcloudhub_install')"); }
    }
}
?><!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Install · IT Cloud Hub</title><link rel="stylesheet" href="admin/admin.css"><body class="auth"><main class="auth-card"><span class="eyebrow">IT CLOUD HUB / SETUP</span><h1>Create your admin account</h1><?php if($done): ?><p class="notice">Installed successfully. Delete install.php from your server now.</p><a class="button" href="admin/login.php">Sign in →</a><?php else: ?><p>Configure MySQL in app/config.php first, then enter your private setup token.</p><?php if($error): ?><p class="error"><?=e($error)?></p><?php endif; ?><form method="post"><?=csrf_input()?><label>Setup token<input name="token" type="password" required autocomplete="off"></label><label>Admin email<input name="email" type="email" required></label><label>Password (12+ characters)<input name="password" type="password" minlength="12" maxlength="72" required autocomplete="new-password"></label><button>Install & create account</button></form><?php endif; ?></main></body></html>

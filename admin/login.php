<?php
require __DIR__.'/../app/bootstrap.php';
header('Cache-Control: no-store');
$error='';
if ($_SERVER['REQUEST_METHOD']==='POST') {
    check_csrf();
    $ip=$_SERVER['REMOTE_ADDR']??'unknown'; $email=strtolower(post('email'));
    $ipLimit=limited('login-ip:'.$ip,20,900); $emailLimit=limited('login-email:'.$email,8,900);
    if ($ipLimit || $emailLimit) $error='Too many attempts. Try again in 15 minutes.';
    else {
        $user=query('SELECT * FROM admins WHERE email=?',[$email])->fetch();
        $valid=password_verify(post('password'),$user['password_hash']??'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.');
        if ($user && $valid) { session_regenerate_id(true); $_SESSION['admin_id']=$user['id']; $_SESSION['active_at']=time(); unset($_SESSION['csrf']); go('admin/'); }
        $error='Email or password is incorrect.';
    }
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin login · IT Cloud Hub</title><link rel="stylesheet" href="admin.css"></head><body class="auth"><main class="auth-card"><span class="eyebrow">IT CLOUD HUB / ADMIN</span><h1>Welcome back.</h1><p>Your enquiries, conversations and next opportunities.</p><?php if($error): ?><p class="error" role="alert"><?=e($error)?></p><?php endif; ?><form method="post"><?=csrf_input()?><label>Email address<input type="email" name="email" required autocomplete="username"></label><label>Password<input type="password" name="password" required autocomplete="current-password"></label><button>Sign in to workspace →</button></form><a class="back" href="<?=e(url())?>">← Back to website</a></main></body></html>

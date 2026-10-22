<?php
require __DIR__.'/../app/bootstrap.php'; admin(); require __DIR__.'/layout.php';
$error='';
if($_SERVER['REQUEST_METHOD']==='POST') {
 check_csrf();
 if(limited('password:'.$_SESSION['admin_id'],5,900)) $error='Too many attempts. Try again in 15 minutes.';
 else { $user=query('SELECT * FROM admins WHERE id=?',[$_SESSION['admin_id']])->fetch();
 if(!password_verify(post('current_password'),$user['password_hash'])) $error='Current password is incorrect.';
 elseif(strlen(post('password'))<12 || strlen(post('password'))>72) $error='New password must contain 12–72 bytes.';
 elseif(post('password')!==post('confirm_password')) $error='Passwords do not match.';
 else { query('UPDATE admins SET password_hash=? WHERE id=?',[password_hash(post('password'),PASSWORD_DEFAULT),$_SESSION['admin_id']]); session_regenerate_id(true); flash('Password changed.'); go('admin/account.php'); }
 }
}
page_start('Account security'); if($error) echo '<p class="error">'.e($error).'</p>';
?><section class="panel narrow"><h2>Change password</h2><form method="post"><?=csrf_input()?><label>Current password<input type="password" name="current_password" required autocomplete="current-password"></label><label>New password<input type="password" name="password" minlength="12" maxlength="72" required autocomplete="new-password"></label><label>Confirm new password<input type="password" name="confirm_password" required autocomplete="new-password"></label><button>Update password</button></form></section><?php page_end(); ?>

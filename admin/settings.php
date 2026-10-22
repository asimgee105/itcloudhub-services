<?php
require __DIR__.'/../app/bootstrap.php'; admin(); require __DIR__.'/layout.php'; require __DIR__.'/../app/mail.php';
$s=settings(); $error='';
if($_SERVER['REQUEST_METHOD']==='POST') {
 check_csrf();
 if(post('action')==='test') {
    if(limited('smtp-test:'.$_SESSION['admin_id'],5,300)) $error='Please wait five minutes before sending more tests.';
    else try { smtp_send($s,'IT Cloud Hub — SMTP test','Your website SMTP connection is working. New enquiry notifications will arrive here when enabled.'); flash('Test message accepted by the SMTP server. Check your inbox and spam folder.'); go('admin/settings.php'); } catch(Throwable $ex) { $error=$ex->getMessage(); }
 } else {
    $fields=['smtp_host','smtp_port','smtp_security','smtp_user','smtp_from','notify_to']; $next=[];
    foreach($fields as $f) $next[$f]=post($f);
    $next['smtp_enabled']=isset($_POST['smtp_enabled'])?'1':'0';
    if(!preg_match('/^[a-zA-Z0-9.-]+$/D',$next['smtp_host']) || strlen($next['smtp_host'])>253) $error='Enter a valid SMTP hostname.';
    elseif(!ctype_digit($next['smtp_port']) || (int)$next['smtp_port']<1 || (int)$next['smtp_port']>65535) $error='Invalid SMTP port.';
    elseif(!in_array($next['smtp_security'],['tls','ssl'],true)) $error='Select STARTTLS or SSL/TLS.';
    elseif(!filter_var($next['smtp_from'],FILTER_VALIDATE_EMAIL) || !filter_var($next['notify_to'],FILTER_VALIDATE_EMAIL)) $error='Enter valid sender and recipient addresses.';
    elseif(strlen($next['smtp_user'])>255 || strlen(post('smtp_password'))>1000) $error='SMTP credentials are too long.';
    else {
        db()->beginTransaction();
        try { foreach($next as $k=>$v) save_setting($k,$v); if(post('smtp_password')!=='') save_setting('smtp_password',encrypt_secret(post('smtp_password'))); db()->commit(); }
        catch(Throwable $ex) { db()->rollBack(); throw $ex; }
        flash('Email settings saved. Send a test to verify delivery.'); go('admin/settings.php');
    }
    $s=array_merge($s,$next);
 }
}
page_start('Email configuration');
?><p class="muted">Configure your mailbox once. New enquiries will be saved and emailed to your notification address.</p><?php if($error): ?><p class="error" role="alert"><?=e($error)?></p><?php endif; ?><div class="detail-grid"><section class="panel"><h2>SMTP connection</h2><form method="post"><?=csrf_input()?><label class="checkbox"><input type="checkbox" name="smtp_enabled" <?=($s['smtp_enabled']??'0')==='1'?'checked':''?>> Enable enquiry email notifications</label><div class="form-grid"><label>SMTP host<input name="smtp_host" value="<?=e($s['smtp_host']??'')?>" placeholder="smtp.example.com" required></label><label>Port<input name="smtp_port" type="number" min="1" max="65535" value="<?=e($s['smtp_port']??'587')?>" required></label></div><label>Encryption<select name="smtp_security"><option value="tls" <?=($s['smtp_security']??'tls')==='tls'?'selected':''?>>STARTTLS (usually 587)</option><option value="ssl" <?=($s['smtp_security']??'')==='ssl'?'selected':''?>>SSL/TLS (usually 465)</option></select></label><label>SMTP username<input name="smtp_user" value="<?=e($s['smtp_user']??'')?>" autocomplete="off"></label><label>SMTP password / app password<input name="smtp_password" type="password" autocomplete="new-password" placeholder="Leave blank to keep saved password"></label><small>Password is encrypted at rest and is never displayed here.</small><label>From email<input type="email" name="smtp_from" value="<?=e($s['smtp_from']??'')?>" required></label><label>Send lead notifications to<input type="email" name="notify_to" value="<?=e($s['notify_to']??'')?>" required></label><button>Save email configuration</button></form></section><section class="panel"><h2>Check your connection</h2><p>Save your settings first, then send a test email to the saved notification address.</p><form method="post"><?=csrf_input()?><input type="hidden" name="action" value="test"><button class="secondary">Send test email →</button></form><h3>Delivery notes</h3><p>Use the SMTP details provided by your email host. The sender address should belong to that mailbox or be authorised by your provider.</p><p>A saved lead stays in the dashboard even if sending fails. Open the lead to retry after fixing the settings.</p><p>“Sent” means the SMTP server accepted the message; inbox delivery depends on your provider and spam filtering.</p></section></div><?php page_end(); ?>

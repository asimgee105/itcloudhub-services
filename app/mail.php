<?php
// Small SMTP transport: authenticated submission with verified TLS. No external packages.
function smtp_send(array $s, string $subject, string $body, string $reply=''): void {
    foreach (['smtp_host','smtp_port','smtp_from','notify_to'] as $k) if (empty($s[$k])) throw new RuntimeException('Email configuration is incomplete.');
    foreach ([$s['smtp_from'],$s['notify_to']] as $email) if (!filter_var($email,FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/',$email)) throw new RuntimeException('Invalid mail address.');
    if ($reply && !filter_var($reply,FILTER_VALIDATE_EMAIL)) throw new RuntimeException('Invalid reply address.');
    $mode=$s['smtp_security']??'tls';
    if (!in_array($mode,['tls','ssl'],true)) throw new RuntimeException('TLS is required.');
    $host=$s['smtp_host'];
    if (!preg_match('/^[a-zA-Z0-9.-]+$/D',$host)) throw new RuntimeException('Invalid SMTP host.');
    $ctx=stream_context_create(['ssl'=>['verify_peer'=>true,'verify_peer_name'=>true,'peer_name'=>$host,'allow_self_signed'=>false]]);
    $socket=stream_socket_client(($mode==='ssl'?'ssl://':'tcp://').$host.':'.(int)$s['smtp_port'],$errno,$errstr,12,STREAM_CLIENT_CONNECT,$ctx);
    if (!$socket) throw new RuntimeException('SMTP connection failed.');
    stream_set_timeout($socket,12);
    $read=function(array $codes) use ($socket): void {
        $line=''; do { $line=fgets($socket,2048); if ($line===false) throw new RuntimeException('SMTP connection timed out or closed.'); } while (isset($line[3]) && $line[3]==='-');
        if (!in_array((int)substr($line,0,3),$codes,true)) throw new RuntimeException('SMTP rejected request ('.(int)substr($line,0,3).').');
    };
    $write=function(string $data) use ($socket): void { while ($data!=='') { $n=fwrite($socket,$data); if (!$n) throw new RuntimeException('SMTP write failed.'); $data=substr($data,$n); } };
    $cmd=function(string $command,array $codes) use ($write,$read): void { $write($command."\r\n"); $read($codes); };
    try {
        $read([220]); $cmd('EHLO itcloudhub.local',[250]);
        if ($mode==='tls') { $cmd('STARTTLS',[220]); if (stream_socket_enable_crypto($socket,true,STREAM_CRYPTO_METHOD_TLS_CLIENT)!==true) throw new RuntimeException('TLS handshake failed.'); $cmd('EHLO itcloudhub.local',[250]); }
        if (!empty($s['smtp_user'])) { $cmd('AUTH LOGIN',[334]); $cmd(base64_encode($s['smtp_user']),[334]); $cmd(base64_encode(decrypt_secret($s['smtp_password']??'')),[235]); }
        $cmd('MAIL FROM:<'.$s['smtp_from'].'>',[250]); $cmd('RCPT TO:<'.$s['notify_to'].'>',[250,251]); $cmd('DATA',[354]);
        $headers=['Date: '.gmdate('D, d M Y H:i:s').' +0000','Message-ID: <'.bin2hex(random_bytes(16)).'@'.$host.'>','From: IT Cloud Hub <'.$s['smtp_from'].'>','To: '.$s['notify_to'],'Subject: =?UTF-8?B?'.base64_encode($subject).'?=','MIME-Version: 1.0','Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: base64'];
        if ($reply) $headers[]='Reply-To: '.$reply;
        $write(implode("\r\n",$headers)."\r\n\r\n".chunk_split(base64_encode($body),76,"\r\n").".\r\n"); $read([250]);
        // Message is accepted at this point; a failed QUIT must not cause a duplicate retry.
        @fwrite($socket,"QUIT\r\n");
    } finally { fclose($socket); }
}
function notify_lead(int $id): bool {
    // Claim before sending, preventing concurrent retries from sending duplicates.
    $claimed=query("UPDATE leads SET mail_status='sending' WHERE id=? AND mail_status IN ('pending','failed','disabled')",[$id]);
    if (!$claimed->rowCount()) return false;
    $lead=query('SELECT * FROM leads WHERE id=?',[$id])->fetch();
    try {
        $s=settings(); if (($s['smtp_enabled']??'0')!=='1') { query("UPDATE leads SET mail_status='disabled' WHERE id=?",[$id]); return false; }
        $body="New website enquiry #{$id}\n\nName: {$lead['name']}\nEmail: {$lead['email']}\nPhone: {$lead['phone']}\nCompany: {$lead['company']}\nService: {$lead['service']}\n\n{$lead['message']}\n\nOpen your website admin panel to manage this lead.";
        smtp_send($s,'New enquiry #'.$id.' — '.$lead['service'],$body,$lead['email']);
        query("UPDATE leads SET mail_status='sent',mail_error=NULL WHERE id=?",[$id]); return true;
    } catch (Throwable $ex) { query("UPDATE leads SET mail_status='failed',mail_error=? WHERE id=?",[substr($ex->getMessage(),0,255),$id]); return false; }
}

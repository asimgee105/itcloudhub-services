<?php
declare(strict_types=1);
ini_set('display_errors', '0');
error_reporting(E_ALL);
set_exception_handler(function(Throwable $e): void {
    error_log('IT Cloud Hub: ' . $e->getMessage());
    http_response_code(500);
    if (str_contains($_SERVER['SCRIPT_NAME'] ?? '', '/submit.php')) {
        header('Content-Type: application/json');
        echo json_encode(['ok'=>false,'message'=>'Unable to process your request. Please try again later.']);
    } else { echo 'Unable to load this page. Check database configuration and server logs.'; }
});
$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) { http_response_code(503); exit('Setup required: copy app/config.example.php to app/config.php and follow README.md.'); }
$config = require $configFile;
if (strlen($config['app_key'] ?? '') < 32 || str_starts_with($config['app_key'], 'CHANGE_')) { http_response_code(503); exit('Set a unique app_key in app/config.php first.'); }
function config(string $key): mixed { global $config; return $config[$key] ?? null; }
function url(string $path = ''): string { return rtrim((string)config('base_path'), '/') . '/' . ltrim($path, '/'); }
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('X-Frame-Options: SAMEORIGIN');
$https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_name('itcloudhub_session');
session_set_cookie_params(['httponly'=>true,'secure'=>$https,'samesite'=>'Lax','path'=>url()]);
session_start();
function db(): PDO {
    static $pdo;
    if (!$pdo) { $d = config('db'); $pdo = new PDO("mysql:host={$d['host']};port={$d['port']};dbname={$d['name']};charset=utf8mb4", $d['user'], $d['password'], [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false]); }
    $pdo->exec("SET time_zone = '+00:00'");
    return $pdo;
}
function query(string $sql, array $args=[]): PDOStatement { $s=db()->prepare($sql); $s->execute($args); return $s; }
function e(mixed $v): string { return htmlspecialchars((string)$v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function csrf(): string { return $_SESSION['csrf'] ??= bin2hex(random_bytes(32)); }
function csrf_input(): string { return '<input type="hidden" name="csrf" value="'.e(csrf()).'">'; }
function valid_csrf(): bool { return is_string($_POST['csrf'] ?? null) && hash_equals(csrf(), $_POST['csrf']); }
function check_csrf(): void { if (!valid_csrf()) { http_response_code(419); exit('Session expired. Reload the form and try again.'); } }
function go(string $path): never { header('Location: '.url($path), true, 303); exit; }
function post(string $key): string { return is_string($_POST[$key] ?? null) ? trim($_POST[$key]) : ''; }
function admin(): void {
    header('Cache-Control: no-store');
    if (empty($_SESSION['admin_id']) || time()-($_SESSION['active_at'] ?? 0)>3600) { unset($_SESSION['admin_id']); go('admin/login.php'); }
    $_SESSION['active_at']=time();
}
function limited(string $key, int $max, int $seconds): bool {
    $key=hash_hmac('sha256',$key,config('app_key'));
    $bucket=(int)floor(time()/$seconds);
    query('INSERT INTO rate_limits (key_hash,bucket,hits,expires_at) VALUES (?,?,1,?) ON DUPLICATE KEY UPDATE hits=hits+1',[$key,$bucket,($bucket+1)*$seconds]);
    $hits=(int)query('SELECT hits FROM rate_limits WHERE key_hash=? AND bucket=?',[$key,$bucket])->fetchColumn();
    if (random_int(1,100)===1) query('DELETE FROM rate_limits WHERE expires_at < ?',[time()]);
    return $hits>$max;
}
function settings(): array { $out=[]; foreach(query('SELECT name,value FROM settings') as $r) $out[$r['name']]=$r['value']; return $out; }
function save_setting(string $name,string $value): void { query('INSERT INTO settings (name,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=VALUES(value)',[$name,$value]); }
function encrypt_secret(string $value): string {
    $iv=random_bytes(12); $tag=''; $cipher=openssl_encrypt($value,'aes-256-gcm',hash('sha256',config('app_key'),true),OPENSSL_RAW_DATA,$iv,$tag);
    if ($cipher===false) throw new RuntimeException('Encryption failed');
    return base64_encode($iv.$tag.$cipher);
}
function decrypt_secret(string $value): string {
    if ($value==='') return ''; $raw=base64_decode($value,true);
    if ($raw===false || strlen($raw)<28) throw new RuntimeException('Invalid encrypted setting');
    $plain=openssl_decrypt(substr($raw,28),'aes-256-gcm',hash('sha256',config('app_key'),true),OPENSSL_RAW_DATA,substr($raw,0,12),substr($raw,12,16));
    if ($plain===false) throw new RuntimeException('Unable to decrypt SMTP password'); return $plain;
}
function flash(string $msg): void { $_SESSION['flash']=$msg; }

<?php
require __DIR__.'/app/bootstrap.php'; require __DIR__.'/app/mail.php';
header('Content-Type: application/json'); header('Cache-Control: no-store');
function respond(int $status,bool $ok,string $message): never { http_response_code($status); echo json_encode(['ok'=>$ok,'message'=>$message]); exit; }
if($_SERVER['REQUEST_METHOD']!=='POST') { header('Allow: POST'); respond(405,false,'Use the contact form to submit an enquiry.'); }
if(!valid_csrf()) respond(419,false,'Your session expired. Refresh the page and try again.');
if(post('website')!=='') respond(422,false,'Unable to accept this submission.');
$key=post('submission_key');
if(!preg_match('/^[a-f0-9]{64}$/D',$key) || !hash_equals($_SESSION['submission_key']??'',$key)) respond(419,false,'Refresh the page before submitting.');
if(query('SELECT id FROM leads WHERE submission_key=?',[$key])->fetchColumn()) respond(200,true,'Thank you! Your enquiry has already been received.');
$fields=['name'=>120,'email'=>190,'phone'=>40,'company'=>150,'topic'=>120,'message'=>5000];
foreach($fields as $field=>$length) if(strlen(post($field))>$length || !preg_match('//u',post($field))) respond(422,false,'Please shorten or correct the '.$field.' field.');
if(post('name')==='' || post('topic')==='' || strlen(post('message'))<10) respond(422,false,'Enter your name, service and a message of at least 10 characters.');
if(!filter_var(post('email'),FILTER_VALIDATE_EMAIL)) respond(422,false,'Enter a valid email address.');
if(!isset($_POST['consent'])) respond(422,false,'Please agree to being contacted about your enquiry.');
if(limited('contact:'.($_SERVER['REMOTE_ADDR']??'unknown'),5,3600)) respond(429,false,'Too many enquiries. Please try again in an hour.');
try { query('INSERT INTO leads(name,email,phone,company,service,message,submission_key) VALUES (?,?,?,?,?,?,?)',[post('name'),post('email'),post('phone'),post('company'),post('topic'),post('message'),$key]); $id=(int)db()->lastInsertId(); }
catch(PDOException $ex) { if($ex->getCode()==='23000') respond(200,true,'Thank you! Your enquiry has already been received.'); throw $ex; }
// Release the session while SMTP waits. The saved lead remains available if delivery fails.
session_write_close();
notify_lead($id);
respond(200,true,'Thank you! Your enquiry has been received. We will contact you soon.');

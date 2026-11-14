<?php
date_default_timezone_set("Asia/Kuala_Lumpur");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../feedback.html");
    exit;
}

function sanitize($value) {
    return trim(strip_tags($value));
}

$name = sanitize($_POST["name"] ?? "");
$gender = sanitize($_POST["gender"] ?? "");
$email = sanitize($_POST["email"] ?? "");
$feedbackType = sanitize($_POST["feedbackType"] ?? "");
$message = sanitize($_POST["message"] ?? "");
$datetime = sanitize($_POST["datetime"] ?? "");

$errors = [];

if ($name === "") {
    $errors[] = "Name is required.";
}

if ($gender === "") {
    $errors[] = "Gender is required.";
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Please enter a valid email address.";
}

if ($feedbackType === "") {
    $errors[] = "Please select the feedback type.";
}

if ($message === "") {
    $errors[] = "Feedback message is required.";
}

if ($datetime === "") {
    $errors[] = "Date and time are required.";
} else {
    $selectedDate = new DateTime($datetime);
    $now = new DateTime();
    if ($selectedDate > $now) {
        $errors[] = "Date and time cannot be in the future.";
    }
}

if (!empty($errors)) {
    echo "<!DOCTYPE html>
    <html lang='en'>
    <head>
      <meta charset='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <title>Feedback Error</title>
      <link rel='preconnect' href='https://fonts.googleapis.com'>
      <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
      <link href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap' rel='stylesheet'>
      <link rel='stylesheet' href='../css/style.css' />
      <style>
        body { padding: 40px 20px; background: #f7f4ef; }
        .message-box { max-width: 700px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 20px 40px rgba(16,38,63,.12); }
        h1 { font-family: 'Cormorant Garamond', serif; color: #10263f; }
        ul { color: #b42318; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class='message-box'>
        <h1>Feedback Submission Error</h1>
        <ul>";
    foreach ($errors as $error) {
        echo "<li>$error</li>";
    }
    echo "</ul>
        <p><a href='../feedback.html' class='btn btn-primary'>Back to Feedback Form</a></p>
      </div>
    </body>
    </html>";
    exit;
}

$folderPath = __DIR__ . "/../data";
if (!is_dir($folderPath)) {
    mkdir($folderPath, 0777, true);
}

$record = [
    "name" => $name,
    "gender" => $gender,
    "email" => $email,
    "feedbackType" => $feedbackType,
    "message" => $message,
    "datetime" => $datetime,
    "submitted_at" => date("Y-m-d H:i:s")
];

$filePath = $folderPath . "/feedback.txt";
$fileHandle = fopen($filePath, "a");
if ($fileHandle === false) {
    die("Unable to create feedback file.");
}

fwrite($fileHandle, json_encode($record) . PHP_EOL);
fclose($fileHandle);

echo "<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8' />
  <meta name='viewport' content='width=device-width, initial-scale=1.0' />
  <title>Feedback Submitted</title>
  <link rel='preconnect' href='https://fonts.googleapis.com'>
  <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>
  <link href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap' rel='stylesheet'>
  <link rel='stylesheet' href='../css/style.css' />
  <style>
    body { padding: 40px 20px; background: #f7f4ef; }
    .message-box { max-width: 700px; margin: 0 auto; background: white; padding: 32px; border-radius: 20px; box-shadow: 0 20px 40px rgba(16,38,63,.12); }
    h1 { font-family: 'Cormorant Garamond', serif; color: #10263f; }
    .details { background: #f8f5f1; padding: 18px; border-radius: 12px; margin-top: 18px; }
  </style>
</head>
<body>
  <div class='message-box'>
    <h1>Thank You for Your Feedback</h1>
    <p>Your message has been submitted successfully.</p>
    <div class='details'>
      <strong>Name:</strong> $name<br>
      <strong>Gender:</strong> $gender<br>
      <strong>Email:</strong> $email<br>
      <strong>Type:</strong> $feedbackType<br>
      <strong>Date & Time:</strong> $datetime
    </div>
    <p><a href='../feedback.html' class='btn btn-primary'>Submit Another Feedback</a></p>
  </div>
</body>
</html>";
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $file = "emails.txt";
        $emails = file_exists($file) ? file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];

        if (!in_array($email, $emails)) {
            file_put_contents($file, $email . PHP_EOL, FILE_APPEND);
            echo "Thanks for subscribing!";
        } else {
            echo "You're already subscribed.";
        }
    } else {
        echo "Invalid email address.";
    }
} else {
    echo "Invalid request.";
}
?>

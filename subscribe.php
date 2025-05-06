<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $file = fopen("emails.txt", "a");
        fwrite($file, $email . "\n");
        fclose($file);
        echo "Thanks for subscribing!";
    } else {
        echo "Invalid email address.";
    }
} else {
    echo "Invalid request.";
}
?>

<?php
session_start();
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"]);
    $password = $_POST["password"];

    $stmt = $conn->prepare("SELECT id, username, password_hash, role FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user["password_hash"])) {
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["username"] = $user["username"];
        $_SESSION["role"] = $user["role"];

        if ($user["role"] === "freelancer") {
            header("Location: freelance_dashboard.php");
        } elseif ($user["role"] === "client") {
            header("Location: client_dashboard.php");
        }
        exit;
    } else {
        $error = "Invalid username or password.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Login - SideQuest</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #1a1a1a;
      color: #e0e0e0;
      font-family: 'Inter', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }

    .login-box {
      background-color: #282828;
      padding: 40px;
      border-radius: 8px;
      width: 380px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      text-align: center;
      box-sizing: border-box;
    }

    .login-box img {
      max-width: 90px;
      margin-bottom: 20px;
      filter: brightness(0.9);
    }

    .title {
      font-size: 2rem;
      margin-bottom: 30px;
      margin-top: 0;
      font-weight: 600;
      color: #f0f0f0;
    }

    input {
      width: 100%;
      padding: 14px 16px;
      margin: 10px 0;
      border: 1px solid #444;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
      background-color: #333;
      color: #e0e0e0;
      transition: border-color 0.3s ease;
    }

    input:focus {
      border-color: #6a6a6a;
      outline: none;
    }

    button {
      width: 100%;
      padding: 14px;
      background-color: #88b649;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1.05rem;
      cursor: pointer;
      margin-top: 20px;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #88b649;
    }

    .error {
      color: #ff6b6b;
      margin-bottom: 16px;
      font-size: 0.95rem;
    }

    p {
      margin-top: 25px;
      font-size: 0.95rem;
    }

    a {
      color: #88b649;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    a:hover {
      color: #88b649;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="login-box">
    <img src="assets/logo.png" alt="SideQuest Logo">
    <h1 class="title">SideQuest</h1>

    <?php if (isset($error)): ?>
      <p class="error"><?= htmlspecialchars($error) ?></p>
    <?php endif; ?>

    <form method="post" action="login.php">
      <input type="text" name="username" placeholder="Username" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    <p>Don't have an account? <a href="selection.php">Register here</a>.</p>
  </div>
</body>
</html>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Register - SideQuest</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Arial', sans-serif;
      background-image: url('assets/header-png.jpg');
      background-size: cover;
      background-position: center;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
    }

    .register-title {
      font-size: 3rem;
      font-weight: bold;
      text-shadow: 2px 2px 5px #000;
      margin-bottom: 20px;
    }

    .register-box {
      background-color: rgba(0, 0, 0, 0.85);
      padding: 40px;
      border-radius: 25px;
      text-align: center;
      width: 400px;
      box-shadow: 0 0 15px #000;
    }

    .register-box h2 {
      margin-bottom: 20px;
      font-size: 2rem;
      text-shadow: 1px 1px 2px #000;
    }

    .register-box input, .register-box select {
      width: 100%;
      padding: 12px;
      margin: 12px 0;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
    }

    .register-box button {
      padding: 10px 20px;
      background-color: crimson;
      color: white;
      font-size: 1rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      margin-top: 10px;
    }

    .login-link {
      margin-top: 15px;
      display: block;
      color: white;
      text-decoration: underline;
      font-size: 0.9rem;
    }

    /* Modal Styles */
    .modal {
      display: block;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0,0,0,0.5);
      justify-content: center;
      align-items: center;
    }

    .modal-content {
      background-color: #fff;
      margin: 15% auto;
      padding: 30px;
      border: 1px solid #888;
      width: 300px;
      text-align: center;
      border-radius: 15px;
      color: black;
    }

    .modal-content button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
    }

    .modal-content button:hover {
      background-color: #218838;
    }
  </style>
</head>
<body>

<?php
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = $_POST["password"];
    $role = $_POST["role"];

    if (!in_array($role, ['client', 'freelancer'])) {
        die("Invalid role.");
    }

    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $email, $password_hash, $role);

    if ($stmt->execute()) {
        echo <<<HTML
        <div class="modal">
          <div class="modal-content">
            <h3>Registration Successful!</h3>
            <p>You can now log in to your account.</p>
            <button onclick="window.location.href='login.php'">Go to Login</button>
          </div>
        </div>
HTML;
        $stmt->close();
        $conn->close();
        exit;
    } else {
        echo "<p>Something went wrong. Please try again later.</p>";
    }

    $stmt->close();
    $conn->close();
}
?>

  <div class="register-title">SideQuest</div>
  <div class="register-box">
    <h2>Register</h2>
    <form action="registration.php" method="post">
      <input type="text" name="username" placeholder="Username" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <select name="role" required>
        <option value="">Select Role</option>
        <option value="freelancer">Freelancer</option>
        <option value="client">Client</option>
      </select>
      <button type="submit">Register</button>
    </form>
    <a class="login-link" href="login.php">Already have an account? Login</a>
  </div>
</body>
</html>

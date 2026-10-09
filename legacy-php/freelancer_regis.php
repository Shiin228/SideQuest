<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<?php
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = trim($_POST["firstname"]);
    $middlename = trim($_POST["middlename"]);
    $lastname = trim($_POST["lastname"]);
    $username = trim($_POST["username"]);
    $email = trim($_POST["email"]);
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $phone = trim($_POST["phone"]);
    $dob = $_POST["dob"];
    $address = trim($_POST["address"]);
    $role = 'freelancer';

    $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $email, $password, $role);

    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        $stmt->close();

        $stmt = $conn->prepare("INSERT INTO freelancers (user_id, firstname, middlename, lastname, phone, dob, address) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issssss", $user_id, $firstname, $middlename, $lastname, $phone, $dob, $address);

        if ($stmt->execute()) {
            echo "<script>
                alert('Registration successful!');
                window.location.href='login.php';
            </script>";
        } else {
            echo "<p>Error saving freelancer details.</p>";
        }
    } else {
        echo "<p>Error creating user account.</p>";
    }

    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Freelancer Registration - SideQuest</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #1a1a1a;
      color: #e0e0e0;
      font-family: 'Inter', sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }

    .title {
      margin-top: 30px;
      font-size: 3rem;
      font-weight: 600;
      color: #f0f0f0;
      text-align: center;
      margin-bottom: 20px;
    }

    .register-box {
      background-color: #282828;
      padding: 40px;
      border-radius: 8px;
      text-align: center;
      width: 800px;
      max-width: 90%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      margin-top: 20px;
      box-sizing: border-box;
    }

    .register-box h2 {
      margin-bottom: 30px;
      font-size: 2rem;
      color: #f0f0f0;
      font-weight: 600;
    }

    .form-grid {
      display: flex;
      gap: 30px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .form-left, .form-right {
      flex: 1;
      min-width: 250px;
      display: flex;
      flex-direction: column;
    }

    input,
    textarea {
      width: 100%;
      padding: 14px 16px;
      margin-bottom: 20px;
      border: 1px solid #444;
      border-radius: 6px;
      font-size: 1rem;
      box-sizing: border-box;
      background-color: #333;
      color: #e0e0e0;
      transition: border-color 0.3s ease;
    }

    input:focus,
    textarea:focus {
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
      margin-top: 10px;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #88b649;
    }

    @media (max-width: 768px) {
      .form-grid {
        flex-direction: column;
      }
    }
  </style>
</head>
<body>
  <div class="title">SideQuest</div>
  <div class="register-box">
    <h2>Freelancer Registration</h2>
    <form action="freelancer_regis.php" method="post">
      <div class="form-grid">
        <div class="form-left">
          <input type="text" name="firstname" placeholder="First Name" required>
          <input type="text" name="middlename" placeholder="Middle Name">
          <input type="text" name="lastname" placeholder="Last Name" required>
          <input type="text" name="username" placeholder="Username" required>
          <input type="email" name="email" placeholder="Email" required>
        </div>
        <div class="form-right">
          <input type="password" name="password" placeholder="Password" required>
          <input type="text" name="phone" placeholder="Phone Number" required>
          <input type="date" name="dob" required>
          <textarea name="address" placeholder="Address" rows="4" required></textarea>
        </div>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</body>
</html>
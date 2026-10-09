<?php
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $client_type = $_POST["client_type"];

    if ($client_type === "individual") {
        $firstname = trim($_POST["firstname"]);
        $middlename = trim($_POST["middlename"]);
        $lastname = trim($_POST["lastname"]);
        $username = trim($_POST["username"]);
        $email = trim($_POST["email"]);
        $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
        $phone = trim($_POST["phone"]);
        $dob = $_POST["dob"];
        $address = trim($_POST["address"]);
        $role = 'client';

        $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $username, $email, $password, $role);

        if ($stmt->execute()) {
            $user_id = $stmt->insert_id;
            $stmt->close();

            $stmt = $conn->prepare("INSERT INTO individual_clients (user_id, firstname, middlename, lastname, phone, dob, address) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("issssss", $user_id, $firstname, $middlename, $lastname, $phone, $dob, $address);

            if ($stmt->execute()) {
                echo "<script>alert('Individual client registered successfully!'); window.location.href='login.php';</script>";
            } else {
                echo "<p>Error saving individual details: " . $stmt->error . "</p>";
            }
        } else {
            echo "<p>Error creating user account: " . $stmt->error . "</p>";
        }

    } elseif ($client_type === "business") {
        $business_name = trim($_POST["business_name"]);
        $email = trim($_POST["email"]);
        $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
        $phone = trim($_POST["phone"]);
        $address = trim($_POST["address"]);
        $role = 'client';

        $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $business_name, $email, $password, $role);

        if ($stmt->execute()) {
            $user_id = $stmt->insert_id;
            $stmt->close();

            $stmt = $conn->prepare("INSERT INTO businesses (user_id, business_name, phone, address) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("isss", $user_id, $business_name, $phone, $address);

            if ($stmt->execute()) {
                echo "<script>alert('Business client registered successfully!'); window.location.href='login.php';</script>";
            } else {
                echo "<p>Error saving business details: " . $stmt->error . "</p>";
            }
        } else {
            echo "<p>Error creating business user account: " . $stmt->error . "</p>";
        }
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
  <title>Client Registration - SideQuest</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #1a1a1a;
      color: #88b649;
      font-family: 'Inter', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }

    .title {
      font-size: 2rem;
      margin-bottom: 30px;
      margin-top: 0;
      font-weight: 600;
      color: #f0f0f0;
      text-align: center;
    }

    .button-group {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }

    .button-group button {
      padding: 10px 20px;
      font-size: 1rem;
      background-color: #88b649;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }

    .button-group button:hover {
      background-color: #88b649;
    }

    .form-box {
      display: none;
      background-color: #282828;
      padding: 40px;
      border-radius: 8px;
      width: 420px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      box-sizing: border-box;
      text-align: center;
    }

    .form-box.active {
      display: block;
    }

    input, textarea {
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

    input:focus, textarea:focus {
      border-color: #6a6a6a;
      outline: none;
    }

    button.submit {
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

    button.submit:hover {
      background-color: #88b649;
    }
  </style>
  <script>
    function showForm(type) {
      document.getElementById("individual-form").classList.remove("active");
      document.getElementById("business-form").classList.remove("active");
      document.getElementById(type + "-form").classList.add("active");
    }
  </script>
</head>
<body>
  <h1 class="title">SideQuest Client Registration</h1>
  <div class="button-group">
    <button onclick="showForm('individual')">Register as Individual</button>
    <button onclick="showForm('business')">Register as Business</button>
  </div>

  <div id="individual-form" class="form-box">
    <form method="post" action="client_regis.php">
      <input type="hidden" name="client_type" value="individual">
      <input type="text" name="firstname" placeholder="First Name" required>
      <input type="text" name="middlename" placeholder="Middle Name">
      <input type="text" name="lastname" placeholder="Last Name" required>
      <input type="text" name="username" placeholder="Username" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <input type="text" name="phone" placeholder="Phone Number" required>
      <input type="date" name="dob" placeholder="mm / dd / yyyy" required>
      <textarea name="address" placeholder="Address" rows="3" required></textarea>
      <button type="submit" class="submit">Register</button>
    </form>
  </div>

  <div id="business-form" class="form-box">
    <form method="post" action="client_regis.php">
      <input type="hidden" name="client_type" value="business">
      <input type="text" name="business_name" placeholder="Business Name" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <input type="text" name="phone" placeholder="Phone Number" required>
      <textarea name="address" placeholder="Address" rows="3" required></textarea>
      <button type="submit" class